import assert from "node:assert/strict";
import test from "node:test";
import {
  createDelegation,
  listReceivedDelegations,
  revokeDelegation,
  clearDelegations,
} from "../src/modules/delegation/delegation.service.js";
import { DomainError } from "../src/lib/errors.js";

test("Delegation Service: successfully delegates a session to a colleague (.edu.vn)", async () => {
  clearDelegations();
  const result = await createDelegation(1, "host@hcmut.edu.vn", {
    sessionId: 101,
    receiverEmail: "colleague@hcmut.edu.vn",
    durationHours: 4,
  });

  assert.equal(result.receiverEmail, "colleague@hcmut.edu.vn");
  assert.equal(result.status, "ACCEPTED");
  assert.equal(result.durationHours, 4);
  assert.ok(result.id > 0);
  assert.ok(new Date(result.delegatedUntil).getTime() > Date.now());
});

test("Delegation Service: rejects self-delegation", async () => {
  await assert.rejects(
    async () => {
      await createDelegation(1, "lecturer@hcmut.edu.vn", {
        sessionId: 101,
        receiverEmail: "lecturer@hcmut.edu.vn",
        durationHours: 2,
      });
    },
    (err: unknown) => {
      assert.ok(err instanceof DomainError);
      assert.equal(err.code, "DELEGATION_NOT_ALLOWED");
      return true;
    }
  );
});

test("Delegation Service: rejects invalid email domains (non-edu)", async () => {
  await assert.rejects(
    async () => {
      await createDelegation(1, "lecturer@hcmut.edu.vn", {
        sessionId: 101,
        receiverEmail: "attacker@gmail.com",
        durationHours: 4,
      });
    },
    (err: unknown) => {
      // Zod validation error for .edu / .edu.vn
      assert.ok(err instanceof Error);
      return true;
    }
  );
});

test("Delegation Service: receiver sees delegated session in their list", async () => {
  clearDelegations();
  await createDelegation(1, "host1@hcmut.edu.vn", {
    sessionId: 201,
    receiverEmail: "substitute@hcmut.edu.vn",
    durationHours: 4,
  });

  const list = listReceivedDelegations("substitute@hcmut.edu.vn");
  assert.equal(list.length, 1);
  assert.equal(list[0].sessionId, 201);
  assert.equal(list[0].receiverEmail, "substitute@hcmut.edu.vn");
});

test("Delegation Service: revokes delegation successfully", async () => {
  clearDelegations();
  const created = await createDelegation(1, "host1@hcmut.edu.vn", {
    sessionId: 301,
    receiverEmail: "substitute@hcmut.edu.vn",
    durationHours: 4,
  });

  const revoked = revokeDelegation("host1@hcmut.edu.vn", created.id);
  assert.equal(revoked.status, "REVOKED");

  // Should no longer appear in active received list
  const list = listReceivedDelegations("substitute@hcmut.edu.vn");
  assert.equal(list.length, 0);
});
