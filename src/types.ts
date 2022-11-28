export interface Identifiable {
    id: string
}

export interface Where<T> {
    where: Partial<T>
}

export interface OrderBy<T> {
    orderBy: Partial<Record<keyof T, "asc" | "desc">>
}

export interface Data<T> {
    data: Partial<T>
}

export type Query<T extends Identifiable> = Partial<Where<T> & OrderBy<T>>
export type Update<T extends Identifiable> = Identifiable & Data<T>
export type UpdateMany<T extends Identifiable[]> = { data: T; where: Where<T> }
export type Create<T extends Identifiable> = Identifiable & { data: T }
export type CreateMany<T extends Identifiable[]> = { data: T }
export type Upsert<T extends Identifiable> = Where<T> & { data: T }

export type ManyResponse = { count: number }

export type Awaitable<T> = T | PromiseLike<T>
