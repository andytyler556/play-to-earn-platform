import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Land NFT Contract", () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe("Minting", () => {
    it("should mint land plot successfully", () => {
      const mintResult = simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      expect(mintResult.result).toBeOk(Cl.uint(1));
    });

    it("should fail to mint with invalid terrain", () => {
      const mintResult = simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("invalid"),
          Cl.uint(25)
        ],
        deployer
      );

      expect(mintResult.result).toBeErr(Cl.uint(105)); // err-invalid-terrain
    });

    it("should fail to mint with invalid coordinates", () => {
      const mintResult = simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(2000), // Out of range
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      expect(mintResult.result).toBeErr(Cl.uint(103)); // err-invalid-coordinates
    });

    it("should fail to mint duplicate coordinates", () => {
      // First mint
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      // Second mint with same coordinates
      const mintResult = simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet2),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("forest"),
          Cl.uint(30)
        ],
        deployer
      );

      expect(mintResult.result).toBeErr(Cl.uint(104)); // err-land-already-exists
    });

    it("should fail when non-owner tries to mint", () => {
      const mintResult = simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        wallet1
      );

      expect(mintResult.result).toBeErr(Cl.uint(100)); // err-owner-only
    });
  });

  describe("Land Data", () => {
    it("should store correct land data", () => {
      // Mint land
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("forest"),
          Cl.uint(50)
        ],
        deployer
      );

      // Get land data
      const landData = simnet.callReadOnlyFn(
        "land-nft",
        "get-land-data",
        [Cl.uint(1)],
        deployer
      );

      expect(landData.result).toBeSome(
        Cl.tuple({
          "x-coordinate": Cl.int(10),
          "y-coordinate": Cl.int(20),
          "terrain-type": Cl.stringAscii("forest"),
          "size": Cl.uint(50),
          "resource-multiplier": Cl.uint(200), // 100 + (50 * 2)
          "rarity": Cl.stringAscii("rare"), // size >= 25
          "created-at": Cl.uint(simnet.blockHeight)
        })
      );
    });

    it("should calculate rarity correctly", () => {
      // Test different size ranges
      const testCases = [
        { size: 5, expectedRarity: "common" },
        { size: 15, expectedRarity: "uncommon" },
        { size: 30, expectedRarity: "rare" },
        { size: 75, expectedRarity: "epic" },
        { size: 150, expectedRarity: "legendary" }
      ];

      testCases.forEach((testCase, index) => {
        simnet.callPublicFn(
          "land-nft",
          "mint-land",
          [
            Cl.principal(wallet1),
            Cl.int(index),
            Cl.int(0),
            Cl.stringAscii("plains"),
            Cl.uint(testCase.size)
          ],
          deployer
        );

        const landData = simnet.callReadOnlyFn(
          "land-nft",
          "get-land-data",
          [Cl.uint(index + 1)],
          deployer
        );

        const data = landData.result as any;
        expect(data.value.data.rarity.data).toBe(testCase.expectedRarity);
      });
    });
  });

  describe("Transfers", () => {
    it("should transfer land successfully", () => {
      // Mint land
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      // Transfer land
      const transferResult = simnet.callPublicFn(
        "land-nft",
        "transfer",
        [
          Cl.uint(1),
          Cl.principal(wallet1),
          Cl.principal(wallet2)
        ],
        wallet1
      );

      expect(transferResult.result).toBeOk(Cl.bool(true));

      // Check new owner
      const ownerResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-owner",
        [Cl.uint(1)],
        deployer
      );

      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(wallet2)));
    });

    it("should fail transfer when not owner", () => {
      // Mint land
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      // Try to transfer from wrong account
      const transferResult = simnet.callPublicFn(
        "land-nft",
        "transfer",
        [
          Cl.uint(1),
          Cl.principal(wallet1),
          Cl.principal(wallet2)
        ],
        wallet2 // Wrong sender
      );

      expect(transferResult.result).toBeErr(Cl.uint(101)); // err-not-token-owner
    });
  });

  describe("Utility Functions", () => {
    it("should get token by coordinates", () => {
      // Mint land
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      // Get token by coordinates
      const tokenResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-token-by-coordinates",
        [Cl.int(10), Cl.int(20)],
        deployer
      );

      expect(tokenResult.result).toBeSome(Cl.uint(1));
    });

    it("should get terrain properties", () => {
      const terrainResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-terrain-properties",
        [Cl.stringAscii("forest")],
        deployer
      );

      expect(terrainResult.result).toBeSome(
        Cl.tuple({
          "base-resource-rate": Cl.uint(150),
          "max-buildings": Cl.uint(8),
          "rarity-modifier": Cl.uint(2)
        })
      );
    });

    it("should get contract info", () => {
      const infoResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-contract-info",
        [],
        deployer
      );

      expect(infoResult.result).toBeOk(
        Cl.tuple({
          "name": Cl.stringUtf8("Virtual Land Plots"),
          "symbol": Cl.stringUtf8("LAND"),
          "decimals": Cl.uint(0),
          "total-supply": Cl.uint(0)
        })
      );
    });
  });

  describe("SIP-009 Compliance", () => {
    it("should get last token id", () => {
      const lastIdResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-last-token-id",
        [],
        deployer
      );

      expect(lastIdResult.result).toBeOk(Cl.uint(0));

      // Mint a token
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      const newLastIdResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-last-token-id",
        [],
        deployer
      );

      expect(newLastIdResult.result).toBeOk(Cl.uint(1));
    });

    it("should set token URI", () => {
      const setUriResult = simnet.callPublicFn(
        "land-nft",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://api.example.com/metadata/"))],
        deployer
      );

      expect(setUriResult.result).toBeOk(Cl.bool(true));

      const uriResult = simnet.callReadOnlyFn(
        "land-nft",
        "get-token-uri",
        [Cl.uint(1)],
        deployer
      );

      expect(uriResult.result).toBeOk(Cl.some(Cl.stringUtf8("https://api.example.com/metadata/")));
    });
  });
});
