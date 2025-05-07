export function findDuplicates(emails: { value: string }[]): string[] {
    const seen = new Set<string>()
    const duplicates = new Set<string>()

    emails.forEach((emailObj) => {
        const email = emailObj.value.toLowerCase()
        if (seen.has(email)) {
            duplicates.add(email) // Only adds unique duplicates
        } else {
            seen.add(email)
        }
    })

    return Array.from(duplicates)
}

export function hasEmptyEmail(emails: { value: string }[]): boolean {
    return emails.some((email) => email.value.trim() === '')
}
