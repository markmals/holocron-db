import {
    Awaitable,
    Create,
    CreateMany,
    Identifiable,
    ManyResponse,
    Query,
    Update,
    UpdateMany,
    Upsert,
    Where,
} from "./types"

export abstract class Database<Model extends Identifiable> {
    constructor(protected path: string) {}

    /**
     * Create a `Model`.
     */
    public abstract create(query: Create<Model>): Awaitable<Model | void>

    /**
     * Create many `Model`s.
     */
    public abstract createMany(query: CreateMany<Model[]>): Awaitable<ManyResponse | void>

    /**
     * Find zero or one `Model` that matches the filter.
     */
    // public abstract findUnique(query: Query<Model>): Awaitable<Model | undefined>

    /**
     * Find the first `Model` that matches the filter.
     */
    public abstract findFirst(query?: Query<Model>): Awaitable<Model | undefined>

    /**
     * Find zero or more `Model`s that match the filter.
     */
    public abstract findMany(query?: Query<Model>): Awaitable<Model[]>

    /**
     * Update one `Model`.
     */
    public abstract update(query: Update<Model>): Awaitable<void>

    /**
     * Update zero or more `Model`s.
     */
    public abstract updateMany(query: UpdateMany<Model[]>): Awaitable<void>

    /**
     * Create or update one `Model`.
     */
    public abstract upsert(query: Upsert<Model>): Awaitable<void>

    /**
     * Delete a `Model`.
     */
    public abstract delete(query: Where<Model>): Awaitable<Model | undefined>

    /**
     * Delete zero or more `Model`s.
     */
    public abstract deleteMany(query?: Where<Model>): Awaitable<ManyResponse | void>
}

export interface Database<Model extends Identifiable> {
    /**
     * Count the number of items in the database.
     *
     * @param where - the filter for the items we want to count
     */
    count?(where?: Where<Model>): Awaitable<number>
}
