;; Building Blueprint NFT Contract
;; SIP-009 compliant NFT for building blueprints in the P2E gaming platform

;; Define the NFT
(define-non-fungible-token building-blueprint uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-not-found (err u102))
(define-constant err-invalid-building-type (err u103))
(define-constant err-invalid-rarity (err u104))

;; Data variables
(define-data-var last-token-id uint u0)
(define-data-var contract-uri (optional (string-utf8 256)) none)

;; Building blueprint data structure
(define-map blueprint-data uint {
  building-type: (string-ascii 20),
  resource-consumption: {
    wood: uint,
    stone: uint,
    metal: uint,
    energy: uint
  },
  output: {
    population-capacity: uint,
    resource-generation: uint,
    defense-bonus: uint,
    happiness-bonus: uint
  },
  rarity: (string-ascii 10),
  build-time: uint,
  maintenance-cost: uint,
  created-at: uint
})

;; Building type templates
(define-map building-templates (string-ascii 20) {
  base-consumption: {wood: uint, stone: uint, metal: uint, energy: uint},
  base-output: {population-capacity: uint, resource-generation: uint, defense-bonus: uint, happiness-bonus: uint},
  base-build-time: uint,
  base-maintenance: uint
})

;; Initialize building templates
(map-set building-templates "residential" {
  base-consumption: {wood: u50, stone: u30, metal: u10, energy: u20},
  base-output: {population-capacity: u10, resource-generation: u0, defense-bonus: u0, happiness-bonus: u5},
  base-build-time: u100,
  base-maintenance: u5
})

(map-set building-templates "commercial" {
  base-consumption: {wood: u30, stone: u40, metal: u20, energy: u30},
  base-output: {population-capacity: u0, resource-generation: u15, defense-bonus: u0, happiness-bonus: u3},
  base-build-time: u150,
  base-maintenance: u8
})

(map-set building-templates "industrial" {
  base-consumption: {wood: u20, stone: u60, metal: u40, energy: u50},
  base-output: {population-capacity: u0, resource-generation: u25, defense-bonus: u0, happiness-bonus: u0},
  base-build-time: u200,
  base-maintenance: u12
})

(map-set building-templates "decorative" {
  base-consumption: {wood: u40, stone: u20, metal: u5, energy: u10},
  base-output: {population-capacity: u0, resource-generation: u0, defense-bonus: u0, happiness-bonus: u10},
  base-build-time: u80,
  base-maintenance: u3
})

;; Rarity multipliers
(define-map rarity-multipliers (string-ascii 10) {
  consumption-multiplier: uint,
  output-multiplier: uint,
  time-multiplier: uint
})

(map-set rarity-multipliers "common" {consumption-multiplier: u100, output-multiplier: u100, time-multiplier: u100})
(map-set rarity-multipliers "uncommon" {consumption-multiplier: u90, output-multiplier: u120, time-multiplier: u90})
(map-set rarity-multipliers "rare" {consumption-multiplier: u80, output-multiplier: u150, time-multiplier: u80})
(map-set rarity-multipliers "epic" {consumption-multiplier: u70, output-multiplier: u200, time-multiplier: u70})
(map-set rarity-multipliers "legendary" {consumption-multiplier: u50, output-multiplier: u300, time-multiplier: u50})

;; Private functions
(define-private (is-valid-building-type (building-type (string-ascii 20)))
  (is-some (map-get? building-templates building-type)))

(define-private (is-valid-rarity (rarity (string-ascii 10)))
  (is-some (map-get? rarity-multipliers rarity)))

(define-private (calculate-stats (building-type (string-ascii 20)) (rarity (string-ascii 10)))
  (let ((template (unwrap-panic (map-get? building-templates building-type)))
        (multipliers (unwrap-panic (map-get? rarity-multipliers rarity))))
    {
      consumption: {
        wood: (/ (* (get wood (get base-consumption template)) (get consumption-multiplier multipliers)) u100),
        stone: (/ (* (get stone (get base-consumption template)) (get consumption-multiplier multipliers)) u100),
        metal: (/ (* (get metal (get base-consumption template)) (get consumption-multiplier multipliers)) u100),
        energy: (/ (* (get energy (get base-consumption template)) (get consumption-multiplier multipliers)) u100)
      },
      output: {
        population-capacity: (/ (* (get population-capacity (get base-output template)) (get output-multiplier multipliers)) u100),
        resource-generation: (/ (* (get resource-generation (get base-output template)) (get output-multiplier multipliers)) u100),
        defense-bonus: (/ (* (get defense-bonus (get base-output template)) (get output-multiplier multipliers)) u100),
        happiness-bonus: (/ (* (get happiness-bonus (get base-output template)) (get output-multiplier multipliers)) u100)
      },
      build-time: (/ (* (get base-build-time template) (get time-multiplier multipliers)) u100),
      maintenance: (/ (* (get base-maintenance template) (get consumption-multiplier multipliers)) u100)
    }))

(define-private (next-token-id)
  (begin
    (var-set last-token-id (+ (var-get last-token-id) u1))
    (var-get last-token-id)))

;; Public functions

;; Mint new blueprint (only contract owner)
(define-public (mint-blueprint (recipient principal) (building-type (string-ascii 20)) (rarity (string-ascii 10)))
  (let ((token-id (next-token-id))
        (stats (calculate-stats building-type rarity)))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-valid-building-type building-type) err-invalid-building-type)
    (asserts! (is-valid-rarity rarity) err-invalid-rarity)
    
    ;; Mint the NFT
    (try! (nft-mint? building-blueprint token-id recipient))
    
    ;; Store blueprint data
    (map-set blueprint-data token-id {
      building-type: building-type,
      resource-consumption: (get consumption stats),
      output: (get output stats),
      rarity: rarity,
      build-time: (get build-time stats),
      maintenance-cost: (get maintenance stats),
      created-at: block-height
    })
    
    (ok token-id)))

;; Transfer blueprint
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (nft-transfer? building-blueprint token-id sender recipient))
    (ok true)))

;; Get blueprint data
(define-read-only (get-blueprint-data (token-id uint))
  (map-get? blueprint-data token-id))

;; Get building template
(define-read-only (get-building-template (building-type (string-ascii 20)))
  (map-get? building-templates building-type))

;; Get rarity multipliers
(define-read-only (get-rarity-multipliers (rarity (string-ascii 10)))
  (map-get? rarity-multipliers rarity))

;; SIP-009 Standard Functions

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id)))

(define-read-only (get-token-uri (token-id uint))
  (ok (var-get contract-uri)))

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? building-blueprint token-id)))

(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set contract-uri new-uri)
    (ok true)))

;; Additional utility functions

(define-read-only (get-contract-info)
  (ok {
    name: "Building Blueprints",
    symbol: "BLUEPRINT",
    decimals: u0,
    total-supply: (var-get last-token-id)
  }))
