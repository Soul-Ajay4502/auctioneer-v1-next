export function splitFullName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/)

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    const firstName = capitalize(parts[0])
    const lastName = capitalize(parts.slice(1).join(' '))

    return { firstName, lastName }
}
