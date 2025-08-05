import { Account, Chain, Clarinet, types } from '@hirosystems/clarinet-sdk';
import { expect } from 'vitest';

const contracts = {
  reputationSystem: 'reputation-system'
};

Clarinet.test({
  name: "Can rate a user successfully",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const alice = accounts.get('wallet_1')!;
    const bob = accounts.get('wallet_2')!;

    // Alice rates Bob with 5 stars
    let block = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(5)],
        alice.address
      )
    ]);

    expect(block.receipts).toHaveLength(1);
    expect(block.receipts[0].result).toBeOk(types.tuple({
      target: types.principal(bob.address),
      rating: types.uint(5),
      'new-reputation': types.uint(5),
      'rating-count': types.uint(1)
    }));
  }
});

Clarinet.test({
  name: "Cannot rate the same user twice",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get('wallet_1')!;
    const bob = accounts.get('wallet_2')!;

    // Alice rates Bob first time
    let block1 = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(5)],
        alice.address
      )
    ]);

    expect(block1.receipts[0].result).toBeOk(types.tuple({
      target: types.principal(bob.address),
      rating: types.uint(5),
      'new-reputation': types.uint(5),
      'rating-count': types.uint(1)
    }));

    // Alice tries to rate Bob again
    let block2 = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(4)],
        alice.address
      )
    ]);

    expect(block2.receipts[0].result).toBeErr(types.uint(102)); // ERR_ALREADY_RATED
  }
});

Clarinet.test({
  name: "Cannot rate yourself",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(alice.address), types.uint(5)],
        alice.address
      )
    ]);

    expect(block.receipts[0].result).toBeErr(types.uint(103)); // ERR_SELF_RATING
  }
});

Clarinet.test({
  name: "Rating must be between 1 and 5",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get('wallet_1')!;
    const bob = accounts.get('wallet_2')!;

    // Try rating with 0
    let block1 = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(0)],
        alice.address
      )
    ]);

    expect(block1.receipts[0].result).toBeErr(types.uint(101)); // ERR_INVALID_RATING

    // Try rating with 6
    let block2 = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(6)],
        alice.address
      )
    ]);

    expect(block2.receipts[0].result).toBeErr(types.uint(101)); // ERR_INVALID_RATING
  }
});

Clarinet.test({
  name: "Can calculate average reputation correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get('wallet_1')!;
    const charlie = accounts.get('wallet_3')!;
    const bob = accounts.get('wallet_2')!;

    // Alice rates Bob with 5
    let block1 = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(5)],
        alice.address
      )
    ]);

    // Charlie rates Bob with 3
    let block2 = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(3)],
        charlie.address
      )
    ]);

    // Check Bob's reputation (should be 4 = (5+3)/2)
    let reputation = chain.callReadOnlyFn(
      contracts.reputationSystem,
      'get-reputation',
      [types.principal(bob.address)],
      alice.address
    );

    expect(reputation.result).toBeUint(4);

    // Check rating count
    let ratingCount = chain.callReadOnlyFn(
      contracts.reputationSystem,
      'get-rating-count',
      [types.principal(bob.address)],
      alice.address
    );

    expect(ratingCount.result).toBeUint(2);
  }
});

Clarinet.test({
  name: "Can check if user has rated another user",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get('wallet_1')!;
    const bob = accounts.get('wallet_2')!;

    // Check before rating
    let hasRatedBefore = chain.callReadOnlyFn(
      contracts.reputationSystem,
      'has-rated',
      [types.principal(alice.address), types.principal(bob.address)],
      alice.address
    );

    expect(hasRatedBefore.result).toBeBool(false);

    // Alice rates Bob
    let block = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(5)],
        alice.address
      )
    ]);

    // Check after rating
    let hasRatedAfter = chain.callReadOnlyFn(
      contracts.reputationSystem,
      'has-rated',
      [types.principal(alice.address), types.principal(bob.address)],
      alice.address
    );

    expect(hasRatedAfter.result).toBeBool(true);
  }
});

Clarinet.test({
  name: "Can get contract statistics",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const alice = accounts.get('wallet_1')!;
    const charlie = accounts.get('wallet_3')!;
    const bob = accounts.get('wallet_2')!;
    const dave = accounts.get('wallet_4')!;

    // Initial stats should be zero
    let initialStats = chain.callReadOnlyFn(
      contracts.reputationSystem,
      'get-contract-stats',
      [],
      alice.address
    );

    expect(initialStats.result).toBeOk(types.tuple({
      'total-ratings': types.uint(0),
      'total-users': types.uint(0)
    }));

    // Add some ratings
    let block = chain.mineBlock([
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(5)],
        alice.address
      ),
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(dave.address), types.uint(4)],
        alice.address
      ),
      Tx.contractCall(
        contracts.reputationSystem,
        'rate-user',
        [types.principal(bob.address), types.uint(3)],
        charlie.address
      )
    ]);

    // Check updated stats
    let finalStats = chain.callReadOnlyFn(
      contracts.reputationSystem,
      'get-contract-stats',
      [],
      alice.address
    );

    expect(finalStats.result).toBeOk(types.tuple({
      'total-ratings': types.uint(3),
      'total-users': types.uint(2) // Bob and Dave
    }));
  }
});
