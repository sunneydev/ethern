import type { ColumnType } from 'kysely'

export type Generated<T> =
	T extends ColumnType<infer S, infer I, infer U>
		? ColumnType<S, I | undefined, U>
		: ColumnType<T, T | undefined, T>

export interface _CfKV {
	key: string
	value: Buffer | null
}

export interface Assets {
	blob_id: number
	created_at: Generated<number>
	id: Generated<number>
	project_id: number
	ref_count: Generated<number>
}

export interface Blobs {
	hash: string
	id: Generated<number>
	size: number
}

export interface D1Migrations {
	applied_at: Generated<string>
	id: Generated<number | null>
	name: string | null
}

export interface Projects {
	created_at: Generated<number>
	deleted_at: number | null
	id: Generated<number>
	name: string
	owner_id: number
	project_id: string
	size: Generated<number>
	team_id: number | null
	uid: string
}

export interface Sessions {
	created_at: Generated<number>
	device: string | null
	expires_at: number
	id: string
	location: string | null
	team_id: number | null
	user_id: number
}

export interface TeamMembers {
	created_at: Generated<number>
	id: Generated<number>
	team_id: number
	user_id: number
}

export interface Teams {
	created_at: Generated<number>
	deleted_at: number | null
	id: Generated<number>
	name: string
	owner_id: number
}

export interface Updates {
	created_at: Generated<number>
	deleted_at: number | null
	id: string
	name: string
	platform: Generated<string>
	project_id: number
	runtime_version: string
}

export interface Users {
	avatar_url: string | null
	created_at: number
	customer_id: string | null
	deleted_at: number | null
	email: string
	id: Generated<number>
	oauth_id: string | null
	onboarded: Generated<number | null>
	password: string | null
	plan: Generated<string>
	provider: string | null
	username: string
	verified: Generated<number>
}

export interface DB {
	assets: Assets
	blobs: Blobs
	projects: Projects
	sessions: Sessions
	team_members: TeamMembers
	teams: Teams
	updates: Updates
	users: Users
}
