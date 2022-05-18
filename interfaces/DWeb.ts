export interface DWeb{
    address:string,
    domain:string,
    homepage:string,
    sitemap?:string // For Indexing
    shouldBeIndexed: boolean // Only Applicable for DEAR indexer but anyone can index by simply storing it into db.
}