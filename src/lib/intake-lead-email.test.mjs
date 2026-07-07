import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

async function importTypeScriptModule(relativePath) {
  const source = await readFile(path.join(currentDir, relativePath), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}

const emailModule = await importTypeScriptModule("./intake-lead-email.ts");

test("createPicWhatsAppMessage tells patient the center received details from Dialisis.my", () => {
  assert.equal(
    emailModule.createPicWhatsAppMessage({
      centerName: "Pusat Dialisis Test",
      fullName: "Ali Ahmad",
    }),
    "Assalamualaikum/Salam sejahtera Ali Ahmad, kami dari pihak Pusat Dialisis Test telah menerima butiran anda daripada Dialisis.my untuk susulan temujanji dialisis."
  );
});

test("createIntakeLeadEmail includes PIC WhatsApp link", () => {
  const whatsappHandoffUrl =
    "https://wa.me/60123456789?text=Assalamualaikum%20Ali";
  const email = emailModule.createIntakeLeadEmail({
    centerName: "Pusat Dialisis Test",
    leadId: "lead_123",
    leadUrl: "https://dialisis.my/intake-leads/token",
    whatsappHandoffUrl,
    fullName: "Ali Ahmad",
    myKadNumber: "900101011234",
    homeAddress: "No 1 Jalan Test",
    preferredDate: "10/07/2026",
    preferredSession: "Pagi",
    phoneNumber: "012-345 6789",
    hasLabResult: false,
  });

  assert.ok(email.html.includes(`href="${whatsappHandoffUrl}"`));
  assert.match(email.html, /WhatsApp pesakit/);
  assert.ok(email.text.includes(`WhatsApp pesakit: ${whatsappHandoffUrl}`));
});
