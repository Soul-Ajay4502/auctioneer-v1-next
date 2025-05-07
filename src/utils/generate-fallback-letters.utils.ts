export function generateFallbackLetters(fullName: string): string {
    const parts = fullName.trim().split(/\s+/)
    const first = parts[0]?.[0]?.toUpperCase() || ''

    if (parts.length > 1) {
        const last = parts[parts.length - 1]?.[0]?.toUpperCase() || ''
        return first + last
    }
    return first
}
