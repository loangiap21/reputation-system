;; Simple Reputation System Contract
;; Allows users to rate each other and build reputation on blockchain

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_RATING (err u101))
(define-constant ERR_ALREADY_RATED (err u102))
(define-constant ERR_SELF_RATING (err u103))
(define-constant ERR_USER_NOT_FOUND (err u104))

;; Data Variables
(define-data-var total-ratings uint u0)
(define-data-var total-users uint u0)

;; Data Maps
;; Store individual ratings: (rater, target) -> rating
(define-map user-ratings
  {
    rater: principal,
    target: principal,
  }
  uint
)

;; Store user reputation data: user -> {total-score, rating-count}
(define-map user-reputation
  principal
  {
    total-score: uint,
    rating-count: uint,
  }
)

;; Store all ratings for a user (for history)
(define-map rating-history
  principal
  (list 100 {
    rater: principal,
    rating: uint,
    timestamp: uint,
  })
)

;; Read-only functions
(define-read-only (get-reputation (user principal))
  (let ((rep-data (default-to {
      total-score: u0,
      rating-count: u0,
    }
      (map-get? user-reputation user)
    )))
    (if (> (get rating-count rep-data) u0)
      (/ (get total-score rep-data) (get rating-count rep-data))
      u0
    )
  )
)

(define-read-only (get-reputation-details (user principal))
  (default-to {
    total-score: u0,
    rating-count: u0,
  }
    (map-get? user-reputation user)
  )
)

(define-read-only (get-rating-count (user principal))
  (get rating-count (get-reputation-details user))
)

(define-read-only (get-total-score (user principal))
  (get total-score (get-reputation-details user))
)

(define-read-only (has-rated
    (rater principal)
    (target principal)
  )
  (is-some (map-get? user-ratings {
    rater: rater,
    target: target,
  }))
)

(define-read-only (get-rating
    (rater principal)
    (target principal)
  )
  (map-get? user-ratings {
    rater: rater,
    target: target,
  })
)

(define-read-only (get-user-rating-history (user principal))
  (default-to (list) (map-get? rating-history user))
)

(define-read-only (get-total-ratings)
  (var-get total-ratings)
)

(define-read-only (get-total-users)
  (var-get total-users)
)

(define-read-only (get-contract-stats)
  {
    total-ratings: (var-get total-ratings),
    total-users: (var-get total-users),
  }
)

;; Public functions
(define-public (rate-user
    (target principal)
    (rating uint)
  )
  (let (
      (rater tx-sender)
      (current-time (unwrap-panic (get-block-info? time (- block-height u1))))
      (current-rep (default-to {
        total-score: u0,
        rating-count: u0,
      }
        (map-get? user-reputation target)
      ))
      (current-history (default-to (list) (map-get? rating-history target)))
    )
    ;; Validations
    (asserts! (and (>= rating u1) (<= rating u5)) ERR_INVALID_RATING)
    (asserts! (not (is-eq rater target)) ERR_SELF_RATING)
    (asserts! (not (has-rated rater target)) ERR_ALREADY_RATED)

    ;; Store the rating
    (map-set user-ratings {
      rater: rater,
      target: target,
    }
      rating
    )

    ;; Update target's reputation
    (map-set user-reputation target {
      total-score: (+ (get total-score current-rep) rating),
      rating-count: (+ (get rating-count current-rep) u1),
    })

    ;; Add to rating history (if space available)
    (if (< (len current-history) u100)
      (map-set rating-history target
        (unwrap-panic (as-max-len?
          (append current-history {
            rater: rater,
            rating: rating,
            timestamp: current-time,
          })
          u100
        ))
      )
      true
    )
    ;; Skip if history is full

    ;; Update global stats
    (var-set total-ratings (+ (var-get total-ratings) u1))
    (if (is-eq (get rating-count current-rep) u0)
      (var-set total-users (+ (var-get total-users) u1))
      true
    )

    (ok {
      target: target,
      rating: rating,
      new-reputation: (get-reputation target),
      rating-count: (+ (get rating-count current-rep) u1),
    })
  )
)

;; Admin functions
(define-public (remove-rating
    (rater principal)
    (target principal)
  )
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)

    (let (
        (rating (unwrap!
          (map-get? user-ratings {
            rater: rater,
            target: target,
          })
          ERR_USER_NOT_FOUND
        ))
        (current-rep (unwrap! (map-get? user-reputation target) ERR_USER_NOT_FOUND))
      )
      ;; Remove the rating
      (map-delete user-ratings {
        rater: rater,
        target: target,
      })

      ;; Update reputation
      (if (> (get rating-count current-rep) u1)
        (map-set user-reputation target {
          total-score: (- (get total-score current-rep) rating),
          rating-count: (- (get rating-count current-rep) u1),
        })
        (map-delete user-reputation target)
      )

      ;; Update global stats
      (var-set total-ratings (- (var-get total-ratings) u1))

      (ok true)
    )
  )
)

;; Helper function to get top rated users (simplified)
(define-read-only (is-highly-rated (user principal))
  (let (
      (reputation (get-reputation user))
      (rating-count (get-rating-count user))
    )
    (and (>= reputation u4) (>= rating-count u3))
  )
)

;; Initialize contract
(begin
  (var-set total-ratings u0)
  (var-set total-users u0)
)
