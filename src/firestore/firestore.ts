import type {
    DocumentReference,
    Firestore,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WriteBatch,
} from "firebase-admin/firestore"
import {
    CollectionReference,
    DocumentData,
    FieldPath,
    Query as FirestoreQuery,
} from "firebase-admin/firestore"
import { Database } from "../database"
import {
    Create,
    CreateMany,
    Identifiable,
    Query,
    Update,
    UpdateMany,
    Upsert,
    Where,
} from "../types"

class GenericConverter<T> implements FirestoreDataConverter<T> {
    public toFirestore(data: T): DocumentData {
        return data as any
    }

    public fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): T {
        return snap.data() as T
    }
}

export class FirestoreCollection<Model extends Identifiable> extends Database<Model> {
    private genericConverter = new GenericConverter<Model>()
    private collection: CollectionReference<Model>

    constructor(path: string, private firestore: Firestore) {
        super(path)
        this.collection = firestore.collection(this.path).withConverter(this.genericConverter)
    }

    public async create(query: Create<Model>) {
        await this.collection.doc(query.id).set(query.data)
    }

    public async createMany(query: CreateMany<Model[]>) {
        await this.batch(query.data, (batch, ref, data) => batch.create(ref, data))
    }

    private async find(query?: Query<Model>, limit?: number): Promise<Model[]> {
        let request = this.collection as FirestoreQuery<Model>

        if (query?.orderBy) {
            for (let [key, direction] of Object.entries(query.orderBy)) {
                request = request.orderBy(key === "id" ? FieldPath.documentId() : key, direction)
            }
        }

        if (query?.where) {
            for (let [key, value] of Object.entries(query.where)) {
                request = request.where(key === "id" ? FieldPath.documentId() : key, "==", value)
            }
        }

        if (limit) {
            request = request.limit(limit)
        }

        let snap = await request.get()
        let data = snap.docs.map(this.identifiableDataConverter) as Model[]
        return data
    }

    public async findFirst(query?: Query<Model>): Promise<Model | undefined> {
        return (await this.find(query, 1))[0]
    }

    public async findMany(query?: Query<Model>): Promise<Model[]> {
        return await this.find(query)
    }

    public async update({ id, data }: Update<Model>) {
        await this.collection.doc(id).update(data as any)
    }

    public async updateMany(query: UpdateMany<Model[]>) {
        await this.batch(query.data, (batch, ref, data) => batch.update(ref, data as any))
    }

    public async upsert(query: Upsert<Model>) {
        await this.collection.doc(query.data.id).set(query.data, { merge: true })
    }

    public async delete({ where }: Where<Model>): Promise<Model | undefined> {
        let model = await this.findFirst({ where })
        if (!model) return undefined
        await this.collection.doc(model.id).delete()
        return model
    }

    public async deleteMany(query?: Where<Model>) {
        let models = await this.findMany({ where: query?.where })
        await this.batch(models, (batch, ref) => batch.delete(ref))
    }

    private async batch(
        data: Model[],
        transform: (batch: WriteBatch, ref: DocumentReference<Model>, data?: Model) => void
    ) {
        let batch = this.firestore.batch()

        for (let model of data) {
            let ref = this.collection.doc(model.id)
            transform(batch, ref, model)
        }

        await batch.commit()
    }

    private identifiableDataConverter(doc: QueryDocumentSnapshot): DocumentData {
        let data = doc.data()
        data.id = doc.id
        return data
    }
}

export function createCollection<Model extends Identifiable>(path: string, firestore: Firestore) {
    return new FirestoreCollection<Model>(path, firestore)
}
