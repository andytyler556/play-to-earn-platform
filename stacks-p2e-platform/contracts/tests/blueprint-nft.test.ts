import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Blueprint NFT Contract", () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe("Minting", () => {
    it("should mint blueprint successfully", () => {
      const mintResult = simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("rare")
        ],
        deployer
      );

      expect(mintResult.result).toBeOk(Cl.uint(1));
    });

    it("should fail to mint with invalid building type", () => {
      const mintResult = simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("invalid"),
          Cl.stringAscii("common")
        ],
        deployer
      );

      expect(mintResult.result).toBeErr(Cl.uint(103)); // err-invalid-building-type
    });

    it("should fail to mint with invalid rarity", () => {
      const mintResult = simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("invalid")
        ],
        deployer
      );

      expect(mintResult.result).toBeErr(Cl.uint(104)); // err-invalid-rarity
    });

    it("should fail when non-owner tries to mint", () => {
      const mintResult = simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("common")
        ],
        wallet1
      );

      expect(mintResult.result).toBeErr(Cl.uint(100)); // err-owner-only
    });
  });

  describe("Blueprint Data", () => {
    it("should store correct blueprint data for residential building", () => {
      // Mint blueprint
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("uncommon")
        ],
        deployer
      );

      // Get blueprint data
      const blueprintData = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-blueprint-data",
        [Cl.uint(1)],
        deployer
      );

      expect(blueprintData.result).toBeSome(
        Cl.tuple({
          "building-type": Cl.stringAscii("residential"),
          "resource-consumption": Cl.tuple({
            "wood": Cl.uint(45), // 50 * 0.9 (uncommon multiplier)
            "stone": Cl.uint(27), // 30 * 0.9
            "metal": Cl.uint(9), // 10 * 0.9
            "energy": Cl.uint(18) // 20 * 0.9
          }),
          "output": Cl.tuple({
            "population-capacity": Cl.uint(12), // 10 * 1.2 (uncommon multiplier)
            "resource-generation": Cl.uint(0),
            "defense-bonus": Cl.uint(0),
            "happiness-bonus": Cl.uint(6) // 5 * 1.2
          }),
          "rarity": Cl.stringAscii("uncommon"),
          "build-time": Cl.uint(90), // 100 * 0.9
          "maintenance-cost": Cl.uint(4), // 5 * 0.9
          "created-at": Cl.uint(simnet.blockHeight)
        })
      );
    });

    it("should calculate stats correctly for different building types", () => {
      const testCases = [
        {
          type: "commercial",
          rarity: "common",
          expectedOutput: { "resource-generation": 15, "happiness-bonus": 3 }
        },
        {
          type: "industrial",
          rarity: "epic",
          expectedOutput: { "resource-generation": 50, "happiness-bonus": 0 } // 25 * 2.0
        },
        {
          type: "decorative",
          rarity: "legendary",
          expectedOutput: { "happiness-bonus": 30 } // 10 * 3.0
        }
      ];

      testCases.forEach((testCase, index) => {
        simnet.callPublicFn(
          "blueprint-nft",
          "mint-blueprint",
          [
            Cl.principal(wallet1),
            Cl.stringAscii(testCase.type),
            Cl.stringAscii(testCase.rarity)
          ],
          deployer
        );

        const blueprintData = simnet.callReadOnlyFn(
          "blueprint-nft",
          "get-blueprint-data",
          [Cl.uint(index + 1)],
          deployer
        );

        const data = blueprintData.result as any;
        expect(data.value.data["building-type"].data).toBe(testCase.type);
        expect(data.value.data.rarity.data).toBe(testCase.rarity);
      });
    });

    it("should apply rarity multipliers correctly", () => {
      // Test legendary rarity with residential building
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("legendary")
        ],
        deployer
      );

      const blueprintData = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-blueprint-data",
        [Cl.uint(1)],
        deployer
      );

      const data = blueprintData.result as any;
      const consumption = data.value.data["resource-consumption"].value.data;
      const output = data.value.data.output.value.data;

      // Legendary: consumption * 0.5, output * 3.0, time * 0.5
      expect(consumption.wood.value).toBe(25); // 50 * 0.5
      expect(consumption.stone.value).toBe(15); // 30 * 0.5
      expect(output["population-capacity"].value).toBe(30); // 10 * 3.0
      expect(output["happiness-bonus"].value).toBe(15); // 5 * 3.0
    });
  });

  describe("Transfers", () => {
    it("should transfer blueprint successfully", () => {
      // Mint blueprint
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("common")
        ],
        deployer
      );

      // Transfer blueprint
      const transferResult = simnet.callPublicFn(
        "blueprint-nft",
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
        "blueprint-nft",
        "get-owner",
        [Cl.uint(1)],
        deployer
      );

      expect(ownerResult.result).toBeOk(Cl.some(Cl.principal(wallet2)));
    });

    it("should fail transfer when not owner", () => {
      // Mint blueprint
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("common")
        ],
        deployer
      );

      // Try to transfer from wrong account
      const transferResult = simnet.callPublicFn(
        "blueprint-nft",
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

  describe("Template and Multiplier Queries", () => {
    it("should get building template correctly", () => {
      const templateResult = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-building-template",
        [Cl.stringAscii("commercial")],
        deployer
      );

      expect(templateResult.result).toBeSome(
        Cl.tuple({
          "base-consumption": Cl.tuple({
            "wood": Cl.uint(30),
            "stone": Cl.uint(40),
            "metal": Cl.uint(20),
            "energy": Cl.uint(30)
          }),
          "base-output": Cl.tuple({
            "population-capacity": Cl.uint(0),
            "resource-generation": Cl.uint(15),
            "defense-bonus": Cl.uint(0),
            "happiness-bonus": Cl.uint(3)
          }),
          "base-build-time": Cl.uint(150),
          "base-maintenance": Cl.uint(8)
        })
      );
    });

    it("should get rarity multipliers correctly", () => {
      const multiplierResult = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-rarity-multipliers",
        [Cl.stringAscii("epic")],
        deployer
      );

      expect(multiplierResult.result).toBeSome(
        Cl.tuple({
          "consumption-multiplier": Cl.uint(70),
          "output-multiplier": Cl.uint(200),
          "time-multiplier": Cl.uint(70)
        })
      );
    });
  });

  describe("SIP-009 Compliance", () => {
    it("should get last token id", () => {
      const lastIdResult = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-last-token-id",
        [],
        deployer
      );

      expect(lastIdResult.result).toBeOk(Cl.uint(0));

      // Mint a token
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("common")
        ],
        deployer
      );

      const newLastIdResult = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-last-token-id",
        [],
        deployer
      );

      expect(newLastIdResult.result).toBeOk(Cl.uint(1));
    });

    it("should get contract info", () => {
      const infoResult = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-contract-info",
        [],
        deployer
      );

      expect(infoResult.result).toBeOk(
        Cl.tuple({
          "name": Cl.stringUtf8("Building Blueprints"),
          "symbol": Cl.stringUtf8("BLUEPRINT"),
          "decimals": Cl.uint(0),
          "total-supply": Cl.uint(0)
        })
      );
    });

    it("should set token URI", () => {
      const setUriResult = simnet.callPublicFn(
        "blueprint-nft",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://api.example.com/blueprints/"))],
        deployer
      );

      expect(setUriResult.result).toBeOk(Cl.bool(true));

      const uriResult = simnet.callReadOnlyFn(
        "blueprint-nft",
        "get-token-uri",
        [Cl.uint(1)],
        deployer
      );

      expect(uriResult.result).toBeOk(Cl.some(Cl.stringUtf8("https://api.example.com/blueprints/")));
    });
  });
});
