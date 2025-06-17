type FormatType =
    | 'ddMonYYYY'
    | 'YYYY-MM-DD'
    | 'MM/DD/YYYY'
    | 'DD/MM/YYYY'
    | 'dd Month YYYY'
    | 'Month dd, YYYY'
    | 'DD-MM-YYYY'
    | 'YYYY/MM/DD'
    | 'ddd, DD MMM YYYY'
    | 'MMMM DD, YYYY'
    | 'DD MMM YYYY'
    | 'YYYYMMDD'
    | 'MM'
    | 'YYYY'
    | 'DD'
    | 'MM-YYYY'

interface FormatDateOptions {
    showTime?: boolean
    timeFormat?: '12h' | '24h'
    timeSeparator?: string
    timeZone?: string
}

export function formatDate(inputDate: string | Date, formatType: FormatType, options: FormatDateOptions = {}): string {
    const {
        showTime = false,
        timeFormat = '24h',
        timeSeparator = '-',
        timeZone = 'Asia/Kolkata', //  Default to India
    } = options

    const date = new Date(inputDate)
    if (isNaN(date.getTime())) return 'Invalid Date'

    const formatOptions = (opts: Intl.DateTimeFormatOptions) => ({
        ...opts,
        timeZone,
    })

    const day = new Intl.DateTimeFormat('en-US', formatOptions({ day: '2-digit' })).format(date)
    const month = new Intl.DateTimeFormat('en-US', formatOptions({ month: '2-digit' })).format(date)
    const year = new Intl.DateTimeFormat('en-US', formatOptions({ year: 'numeric' })).format(date)

    const shortMonth = new Intl.DateTimeFormat('en-US', formatOptions({ month: 'short' })).format(date)
    const longMonth = new Intl.DateTimeFormat('en-US', formatOptions({ month: 'long' })).format(date)
    const weekdayShort = new Intl.DateTimeFormat('en-US', formatOptions({ weekday: 'short' })).format(date)

    // Time formatting
    const getTimeString = () => {
        if (!showTime) return ''

        const hours = new Intl.DateTimeFormat('en-US', formatOptions({ hour: '2-digit', hour12: timeFormat === '12h' })).format(
            date,
        )
        const minutes = new Intl.DateTimeFormat('en-US', formatOptions({ minute: '2-digit' })).format(date)

        return timeFormat === '12h' ? ` ${timeSeparator} ${hours}:${minutes}` : ` ${timeSeparator} ${hours}:${minutes}`
    }

    const timeString = getTimeString()

    switch (formatType) {
        case 'ddMonYYYY':
            return `${day} ${shortMonth}, ${year}${timeString}`
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}${timeString}`
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}${timeString}`
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}${timeString}`
        case 'dd Month YYYY':
            return `${day} ${longMonth} ${year}${timeString}`
        case 'Month dd, YYYY':
            return `${longMonth} ${day}, ${year}${timeString}`
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}${timeString}`
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}${timeString}`
        case 'ddd, DD MMM YYYY':
            return `${weekdayShort}, ${day} ${shortMonth} ${year}${timeString}`
        case 'MMMM DD, YYYY':
            return `${longMonth} ${day}, ${year}${timeString}`
        case 'DD MMM YYYY':
            return `${day} ${shortMonth} ${year}${timeString}`
        case 'YYYYMMDD':
            return `${year}${month}${day}${timeString.replace(/[^0-9]/g, '')}`
        case 'MM':
            return `${longMonth}`
        case 'YYYY':
            return `${year}`
        case 'DD':
            return `${day}`
        case 'MM-YYYY':
            return `${longMonth} ${year}`
        default:
            return date.toISOString()
    }
}
