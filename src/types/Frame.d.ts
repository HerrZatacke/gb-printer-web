/*
* On Type-Changes, a history for migration must be kept in /src/javascript/app/stores/migrations/history/
* */
export interface Frame {
  id: string,
  hash: string,
  name: string,
  tempId?: string,
}
