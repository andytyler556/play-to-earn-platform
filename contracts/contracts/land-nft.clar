;; Land NFT Contract
;; SIP-009 compliant NFT for virtual land plots in the P2E gaming platform

;; Define the NFT
(define-non-fungible-token land-plot uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-not-found (err u102))
(define-constant err-invalid-coordinates (err u103))
(define-constant err-land-already-exists (err u104))
(define-constant err-invalid-terrain (err u105))

;; Data variables
(define-data-var last-token-id uint u0)
(define-data-var contract-uri (optional (string-utf8 256)) none)

;; Land plot data structure
(define-map land-data uint {
  x-coordinate: int,
  y-coordinate: int,
  terrain-type: (string-ascii 20),
  size: uint,
  resource-multiplier: uint,
  rarity: (string-ascii 10),
  created-at: uint
})

;; Coordinate to token mapping (prevents duplicate coordinates)
(define-map coordinate-to-token {x: int, y: int} uint)

;; Terrain types and their properties
(define-map terrain-properties (string-ascii 20) {
  base-resource-rate: uint,
  max-buildings: uint,
  rarity-modifier: uint
})

;; Initialize terrain types
(map-set terrain-properties "plains" {base-resource-rate: u100, max-buildings: u10, rarity-modifier: u1})
(map-set terrain-properties "forest" {base-resource-rate: u150, max-buildings: u8, rarity-modifier: u2})
(map-set terrain-properties "mountain" {base-resource-rate: u200, max-buildings: u6, rarity-modifier: u3})
(map-set terrain-properties "desert" {base-resource-rate: u80, max-buildings: u12, rarity-modifier: u1})
(map-set terrain-properties "coastal" {base-resource-rate: u120, max-buildings: u9, rarity-modifier: u4})
(map-set terrain-properties "volcanic" {base-resource-rate: u300, max-buildings: u4, rarity-modifier: u5})

;; Private functions
(define-private (is-valid-terrain (terrain (string-ascii 20)))
  (is-some (map-get? terrain-properties terrain)))

(define-private (calculate-rarity (terrain (string-ascii 20)) (size uint))
  (let ((terrain-data (unwrap-panic (map-get? terrain-properties terrain))))
    (if (>= size u100)
      "legendary"
      (if (>= size u50)
        "epic"
        (if (>= size u25)
          "rare"
          (if (>= size u10)
            "uncommon"
            "common"))))))

(define-private (next-token-id)
  (begin
    (var-set last-token-id (+ (var-get last-token-id) u1))
    (var-get last-token-id)))

;; Public functions

;; Mint new land plot (only contract owner)
(define-public (mint-land (recipient principal) (x int) (y int) (terrain (string-ascii 20)) (size uint))
  (let ((token-id (next-token-id))
        (rarity (calculate-rarity terrain size)))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-valid-terrain terrain) err-invalid-terrain)
    (asserts! (and (>= x -1000) (<= x 1000) (>= y -1000) (<= y 1000)) err-invalid-coordinates)
    (asserts! (is-none (map-get? coordinate-to-token {x: x, y: y})) err-land-already-exists)
    
    ;; Mint the NFT
    (try! (nft-mint? land-plot token-id recipient))
    
    ;; Store land data
    (map-set land-data token-id {
      x-coordinate: x,
      y-coordinate: y,
      terrain-type: terrain,
      size: size,
      resource-multiplier: (+ u100 (* size u2)),
      rarity: rarity,
      created-at: block-height
    })
    
    ;; Map coordinates to token
    (map-set coordinate-to-token {x: x, y: y} token-id)
    
    (ok token-id)))

;; Transfer land plot
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (nft-transfer? land-plot token-id sender recipient))
    (ok true)))

;; Get land data
(define-read-only (get-land-data (token-id uint))
  (map-get? land-data token-id))

;; Get token by coordinates
(define-read-only (get-token-by-coordinates (x int) (y int))
  (map-get? coordinate-to-token {x: x, y: y}))

;; Get terrain properties
(define-read-only (get-terrain-properties (terrain (string-ascii 20)))
  (map-get? terrain-properties terrain))

;; SIP-009 Standard Functions

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id)))

(define-read-only (get-token-uri (token-id uint))
  (ok (var-get contract-uri)))

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? land-plot token-id)))

(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set contract-uri new-uri)
    (ok true)))

;; Additional utility functions

(define-read-only (get-tokens-owned (owner principal))
  (ok (list)))  ;; This would need to be implemented with a more complex indexing system

(define-read-only (get-contract-info)
  (ok {
    name: "Virtual Land Plots",
    symbol: "LAND",
    decimals: u0,
    total-supply: (var-get last-token-id)
  }))
