;; Platform Token Contract
;; SIP-010 compliant fungible token for the P2E gaming platform

;; Define the token
(define-fungible-token platform-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-not-authorized (err u104))

;; Token metadata
(define-data-var token-name (string-ascii 32) "P2E Platform Token")
(define-data-var token-symbol (string-ascii 10) "P2E")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)

;; Total supply and minting controls
(define-data-var total-supply uint u0)
(define-data-var max-supply uint u1000000000000) ;; 1 million tokens with 6 decimals
(define-data-var minting-enabled bool true)

;; Authorized minters (games, reward contracts, etc.)
(define-data-var authorized-minters (list 10 principal) (list))

;; Staking system
(define-map staking-pools principal {
  staked-amount: uint,
  stake-start-block: uint,
  last-reward-block: uint,
  accumulated-rewards: uint
})

(define-data-var staking-reward-rate uint u100) ;; Rewards per block per token staked
(define-data-var min-stake-duration uint u1008) ;; ~1 week in blocks

;; Governance system (basic)
(define-map proposals uint {
  proposer: principal,
  title: (string-utf8 100),
  description: (string-utf8 500),
  votes-for: uint,
  votes-against: uint,
  end-block: uint,
  executed: bool
})

(define-map votes {proposal-id: uint, voter: principal} {
  amount: uint,
  vote: bool ;; true for yes, false for no
})

(define-data-var last-proposal-id uint u0)
(define-data-var proposal-threshold uint u10000000) ;; 10 tokens to create proposal

;; Private functions
(define-private (is-authorized-minter (minter principal))
  (or (is-eq minter contract-owner)
      (is-some (index-of (var-get authorized-minters) minter))))

(define-private (calculate-staking-rewards (staker principal))
  (match (map-get? staking-pools staker)
    staking-data 
      (let ((blocks-staked (- block-height (get last-reward-block staking-data)))
            (reward-amount (/ (* (get staked-amount staking-data) 
                                (var-get staking-reward-rate) 
                                blocks-staked) 
                             u1000000))) ;; Normalize reward calculation
        reward-amount)
    u0))

;; Public functions

;; Mint tokens (only authorized minters)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-authorized-minter tx-sender) err-not-authorized)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= (+ (var-get total-supply) amount) (var-get max-supply)) err-invalid-amount)
    (asserts! (var-get minting-enabled) err-not-authorized)
    
    (try! (ft-mint? platform-token amount recipient))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)))

;; Burn tokens
(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (try! (ft-burn? platform-token amount tx-sender))
    (var-set total-supply (- (var-get total-supply) amount))
    (ok true)))

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? platform-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)))

;; Staking functions

;; Stake tokens
(define-public (stake (amount uint))
  (let ((current-stake (default-to {staked-amount: u0, stake-start-block: u0, last-reward-block: u0, accumulated-rewards: u0}
                                  (map-get? staking-pools tx-sender))))
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= (ft-get-balance platform-token tx-sender) amount) err-insufficient-balance)
    
    ;; Calculate and add pending rewards
    (let ((pending-rewards (calculate-staking-rewards tx-sender)))
      
      ;; Transfer tokens to contract for staking
      (try! (ft-transfer? platform-token amount tx-sender (as-contract tx-sender)))
      
      ;; Update staking data
      (map-set staking-pools tx-sender {
        staked-amount: (+ (get staked-amount current-stake) amount),
        stake-start-block: (if (is-eq (get staked-amount current-stake) u0) block-height (get stake-start-block current-stake)),
        last-reward-block: block-height,
        accumulated-rewards: (+ (get accumulated-rewards current-stake) pending-rewards)
      })
      
      (ok true))))

;; Unstake tokens
(define-public (unstake (amount uint))
  (let ((staking-data (unwrap! (map-get? staking-pools tx-sender) err-insufficient-balance)))
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= (get staked-amount staking-data) amount) err-insufficient-balance)
    (asserts! (>= (- block-height (get stake-start-block staking-data)) (var-get min-stake-duration)) err-not-authorized)
    
    ;; Calculate pending rewards
    (let ((pending-rewards (calculate-staking-rewards tx-sender)))
      
      ;; Transfer tokens back to user
      (try! (as-contract (ft-transfer? platform-token amount tx-sender tx-sender)))
      
      ;; Update staking data
      (if (is-eq amount (get staked-amount staking-data))
        ;; Complete unstake
        (map-delete staking-pools tx-sender)
        ;; Partial unstake
        (map-set staking-pools tx-sender {
          staked-amount: (- (get staked-amount staking-data) amount),
          stake-start-block: (get stake-start-block staking-data),
          last-reward-block: block-height,
          accumulated-rewards: (+ (get accumulated-rewards staking-data) pending-rewards)
        }))
      
      (ok true))))

;; Claim staking rewards
(define-public (claim-staking-rewards)
  (let ((staking-data (unwrap! (map-get? staking-pools tx-sender) err-insufficient-balance))
        (pending-rewards (calculate-staking-rewards tx-sender))
        (total-rewards (+ (get accumulated-rewards staking-data) pending-rewards)))
    
    (asserts! (> total-rewards u0) err-invalid-amount)
    
    ;; Mint reward tokens
    (try! (as-contract (ft-mint? platform-token total-rewards tx-sender)))
    (var-set total-supply (+ (var-get total-supply) total-rewards))
    
    ;; Update staking data
    (map-set staking-pools tx-sender 
      (merge staking-data {
        last-reward-block: block-height,
        accumulated-rewards: u0
      }))
    
    (ok total-rewards)))

;; Governance functions

;; Create proposal
(define-public (create-proposal (title (string-utf8 100)) (description (string-utf8 500)) (voting-duration uint))
  (let ((proposal-id (+ (var-get last-proposal-id) u1)))
    (asserts! (>= (ft-get-balance platform-token tx-sender) (var-get proposal-threshold)) err-insufficient-balance)
    
    (map-set proposals proposal-id {
      proposer: tx-sender,
      title: title,
      description: description,
      votes-for: u0,
      votes-against: u0,
      end-block: (+ block-height voting-duration),
      executed: false
    })
    
    (var-set last-proposal-id proposal-id)
    (ok proposal-id)))

;; Vote on proposal
(define-public (vote (proposal-id uint) (vote-yes bool) (amount uint))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) err-invalid-amount)))
    (asserts! (< block-height (get end-block proposal)) err-not-authorized)
    (asserts! (>= (ft-get-balance platform-token tx-sender) amount) err-insufficient-balance)
    (asserts! (is-none (map-get? votes {proposal-id: proposal-id, voter: tx-sender})) err-not-authorized)
    
    ;; Record vote
    (map-set votes {proposal-id: proposal-id, voter: tx-sender} {
      amount: amount,
      vote: vote-yes
    })
    
    ;; Update proposal vote counts
    (map-set proposals proposal-id 
      (if vote-yes
        (merge proposal {votes-for: (+ (get votes-for proposal) amount)})
        (merge proposal {votes-against: (+ (get votes-against proposal) amount)})))
    
    (ok true)))

;; Admin functions

(define-public (add-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set authorized-minters (unwrap-panic (as-max-len? (append (var-get authorized-minters) minter) u10)))
    (ok true)))

(define-public (set-minting-enabled (enabled bool))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set minting-enabled enabled)
    (ok true)))

(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri new-uri)
    (ok true)))

;; SIP-010 Standard Functions

(define-read-only (get-name)
  (ok (var-get token-name)))

(define-read-only (get-symbol)
  (ok (var-get token-symbol)))

(define-read-only (get-decimals)
  (ok (var-get token-decimals)))

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance platform-token who)))

(define-read-only (get-total-supply)
  (ok (var-get total-supply)))

(define-read-only (get-token-uri)
  (ok (var-get token-uri)))

;; Additional read-only functions

(define-read-only (get-staking-data (staker principal))
  (map-get? staking-pools staker))

(define-read-only (get-pending-rewards (staker principal))
  (ok (calculate-staking-rewards staker)))

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id))

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes {proposal-id: proposal-id, voter: voter}))
