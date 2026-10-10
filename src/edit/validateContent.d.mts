import type { Document } from 'yaml'

export type ContentIssue = { path: (string | number)[]; message: string }
export function validateContent(source: string): { issues: ContentIssue[]; document: Document }
