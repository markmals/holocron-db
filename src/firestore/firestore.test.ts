import * as admin from "firebase-admin"
import { beforeEach, describe, expect, test } from "vitest"
import { createCollection } from "./firestore"

// First set up unique project id for these tests, so that any other test files run in parallel
// is not collapsing with this one.
const projectId = "sample"

process.env.GCLOUD_PROJECT = projectId
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
admin.initializeApp({ projectId })

const db = admin.firestore()

describe("Firebase test", () => {
    type Company = { id: string; name: string }
    let companies = createCollection<Company>("companies", db)

    beforeEach(async () => {
        await companies.deleteMany()
    })

    test(
        "dummy test",
        async () => {
            let company = await companies.findMany()
            expect(company.length).toBeFalsy()

            let data = { id: "1", name: "Testers Inc." }
            // write actual document to database
            await companies.create({ id: data.id, data })
            // get document snapshot
            let companyAfterCreate = await companies.findFirst()
            company = await companies.findMany()
            expect(company.length).toBeTruthy()
            expect(companyAfterCreate?.name).toBe("Testers Inc.")
        },
        { timeout: 0.01, retry: 0 }
    )
})
