;; Game Rewards Contract
;; Manages P2E mechanics, competitions, and reward distribution

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-competition-not-found (err u102))
(define-constant err-competition-not-active (err u103))
(define-constant err-already-participated (err u104))
(define-constant err-invalid-score (err u105))
(define-constant err-competition-ended (err u106))
(define-constant err-rewards-already-claimed (err u107))

;; Data variables
(define-data-var last-competition-id uint u0)
(define-data-var authorized-games (list 10 principal) (list))

;; Competition data structure
(define-map competitions uint {
  name: (string-utf8 100),
  description: (string-utf8 500),
  competition-type: (string-ascii 20), ;; "building", "design", "resource", etc.
  start-block: uint,
  end-block: uint,
  max-participants: uint,
  entry-fee: uint,
  prize-pool: uint,
  is-active: bool,
  created-by: principal
})

;; Participant data
(define-map participants {competition-id: uint, participant: principal} {
  score: uint,
  submission-data: (string-utf8 500), ;; JSON string or IPFS hash
  submitted-at: uint,
  rank: (optional uint),
  reward-claimed: bool
})

;; Competition leaderboard
(define-map leaderboards {competition-id: uint, rank: uint} principal)

;; Daily quest system
(define-map daily-quests principal {
  last-claim-day: uint,
  consecutive-days: uint,
  total-completed: uint
})

;; Achievement system
(define-map achievements (string-ascii 50) {
  name: (string-utf8 100),
  description: (string-utf8 300),
  reward-type: (string-ascii 20), ;; "nft", "token", "blueprint"
  reward-amount: uint,
  requirement: uint
})

(define-map user-achievements {user: principal, achievement: (string-ascii 50)} {
  unlocked-at: uint,
  claimed: bool
})

;; Initialize achievements
(map-set achievements "first-land" {
  name: u"Land Owner",
  description: u"Own your first piece of virtual land",
  reward-type: "blueprint",
  reward-amount: u1,
  requirement: u1
})

(map-set achievements "master-builder" {
  name: u"Master Builder",
  description: u"Build 10 structures",
  reward-type: "nft",
  reward-amount: u1,
  requirement: u10
})

(map-set achievements "competition-winner" {
  name: u"Competition Champion",
  description: u"Win a building competition",
  reward-type: "token",
  reward-amount: u1000,
  requirement: u1
})

;; Private functions
(define-private (next-competition-id)
  (begin
    (var-set last-competition-id (+ (var-get last-competition-id) u1))
    (var-get last-competition-id)))

(define-private (is-authorized-game (game principal))
  (is-some (index-of (var-get authorized-games) game)))

(define-private (get-current-day)
  (/ block-height u144)) ;; Assuming ~10 min blocks, 144 blocks per day

;; Public functions

;; Create competition
(define-public (create-competition 
  (name (string-utf8 100))
  (description (string-utf8 500))
  (competition-type (string-ascii 20))
  (duration uint)
  (max-participants uint)
  (entry-fee uint))
  (let ((competition-id (next-competition-id)))
    (asserts! (or (is-eq tx-sender contract-owner) (is-authorized-game tx-sender)) err-not-authorized)
    
    (map-set competitions competition-id {
      name: name,
      description: description,
      competition-type: competition-type,
      start-block: block-height,
      end-block: (+ block-height duration),
      max-participants: max-participants,
      entry-fee: entry-fee,
      prize-pool: u0,
      is-active: true,
      created-by: tx-sender
    })
    
    (ok competition-id)))

;; Join competition
(define-public (join-competition (competition-id uint))
  (let ((competition (unwrap! (map-get? competitions competition-id) err-competition-not-found)))
    (asserts! (get is-active competition) err-competition-not-active)
    (asserts! (< block-height (get end-block competition)) err-competition-ended)
    (asserts! (is-none (map-get? participants {competition-id: competition-id, participant: tx-sender})) err-already-participated)
    
    ;; Pay entry fee if required
    (if (> (get entry-fee competition) u0)
      (try! (stx-transfer? (get entry-fee competition) tx-sender contract-owner))
      true)
    
    ;; Add participant
    (map-set participants {competition-id: competition-id, participant: tx-sender} {
      score: u0,
      submission-data: u"",
      submitted-at: u0,
      rank: none,
      reward-claimed: false
    })
    
    ;; Update prize pool
    (map-set competitions competition-id 
      (merge competition {prize-pool: (+ (get prize-pool competition) (get entry-fee competition))}))
    
    (ok true)))

;; Submit competition entry
(define-public (submit-entry (competition-id uint) (score uint) (submission-data (string-utf8 500)))
  (let ((competition (unwrap! (map-get? competitions competition-id) err-competition-not-found))
        (participant-data (unwrap! (map-get? participants {competition-id: competition-id, participant: tx-sender}) err-not-authorized)))
    
    (asserts! (get is-active competition) err-competition-not-active)
    (asserts! (< block-height (get end-block competition)) err-competition-ended)
    (asserts! (> score u0) err-invalid-score)
    
    ;; Update participant data
    (map-set participants {competition-id: competition-id, participant: tx-sender}
      (merge participant-data {
        score: score,
        submission-data: submission-data,
        submitted-at: block-height
      }))
    
    (ok true)))

;; Complete daily quest
(define-public (complete-daily-quest)
  (let ((current-day (get-current-day))
        (quest-data (default-to {last-claim-day: u0, consecutive-days: u0, total-completed: u0} 
                                (map-get? daily-quests tx-sender))))
    
    ;; Check if already completed today
    (asserts! (not (is-eq (get last-claim-day quest-data) current-day)) err-already-participated)
    
    ;; Calculate consecutive days
    (let ((new-consecutive (if (is-eq (get last-claim-day quest-data) (- current-day u1))
                             (+ (get consecutive-days quest-data) u1)
                             u1)))
      
      ;; Update quest data
      (map-set daily-quests tx-sender {
        last-claim-day: current-day,
        consecutive-days: new-consecutive,
        total-completed: (+ (get total-completed quest-data) u1)
      })
      
      ;; Reward based on consecutive days
      (let ((reward-amount (if (>= new-consecutive u7) u100 ;; Weekly bonus
                            (if (>= new-consecutive u3) u50  ;; 3-day bonus
                              u20))))                        ;; Daily reward
        ;; This would mint platform tokens or other rewards
        (ok reward-amount)))))

;; Unlock achievement
(define-public (unlock-achievement (achievement-id (string-ascii 50)) (user principal))
  (let ((achievement (unwrap! (map-get? achievements achievement-id) err-competition-not-found)))
    (asserts! (or (is-eq tx-sender contract-owner) (is-authorized-game tx-sender)) err-not-authorized)
    
    ;; Check if already unlocked
    (asserts! (is-none (map-get? user-achievements {user: user, achievement: achievement-id})) err-already-participated)
    
    ;; Unlock achievement
    (map-set user-achievements {user: user, achievement: achievement-id} {
      unlocked-at: block-height,
      claimed: false
    })
    
    (ok true)))

;; Claim achievement reward
(define-public (claim-achievement-reward (achievement-id (string-ascii 50)))
  (let ((achievement (unwrap! (map-get? achievements achievement-id) err-competition-not-found))
        (user-achievement (unwrap! (map-get? user-achievements {user: tx-sender, achievement: achievement-id}) err-not-authorized)))
    
    (asserts! (not (get claimed user-achievement)) err-rewards-already-claimed)
    
    ;; Mark as claimed
    (map-set user-achievements {user: tx-sender, achievement: achievement-id}
      (merge user-achievement {claimed: true}))
    
    ;; This would mint the actual reward (NFT, tokens, etc.)
    (ok (get reward-amount achievement))))

;; Admin functions

(define-public (add-authorized-game (game principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set authorized-games (unwrap-panic (as-max-len? (append (var-get authorized-games) game) u10)))
    (ok true)))

(define-public (remove-authorized-game (game principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set authorized-games (filter is-not-game (var-get authorized-games)))
    (ok true)))

(define-private (is-not-game (g principal))
  (not (is-eq g (unwrap-panic (element-at (var-get authorized-games) u0)))))

(define-public (end-competition (competition-id uint))
  (let ((competition (unwrap! (map-get? competitions competition-id) err-competition-not-found)))
    (asserts! (or (is-eq tx-sender contract-owner) (is-eq tx-sender (get created-by competition))) err-not-authorized)
    
    (map-set competitions competition-id (merge competition {is-active: false}))
    (ok true)))

;; Read-only functions

(define-read-only (get-competition (competition-id uint))
  (map-get? competitions competition-id))

(define-read-only (get-participant (competition-id uint) (participant principal))
  (map-get? participants {competition-id: competition-id, participant: participant}))

(define-read-only (get-daily-quest-status (user principal))
  (map-get? daily-quests user))

(define-read-only (get-achievement (achievement-id (string-ascii 50)))
  (map-get? achievements achievement-id))

(define-read-only (get-user-achievement (user principal) (achievement-id (string-ascii 50)))
  (map-get? user-achievements {user: user, achievement: achievement-id}))

(define-read-only (get-authorized-games)
  (var-get authorized-games))

(define-read-only (get-last-competition-id)
  (var-get last-competition-id))
