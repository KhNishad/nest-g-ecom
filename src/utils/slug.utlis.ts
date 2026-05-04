export function generateSlug(text: string): string {
    return text
        .toLowerCase()                          // 'My Category' → 'my category'
        .trim()                                 // remove leading/trailing spaces
        .replace(/[^\w\s-]/g, '')              // remove special chars (!@#$%^&*)
        .replace(/[\s_]+/g, '-')              // spaces/underscores → hyphens
        .replace(/-+/g, '-')                  // multiple hyphens → single hyphen
        .replace(/^-+|-+$/g, '');             // remove leading/trailing hyphens
}