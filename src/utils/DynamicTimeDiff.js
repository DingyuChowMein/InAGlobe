export default function dynamicTimeDiff(datetime) {
    var dateObj = new Date(datetime) 
    var diffSeconds = (new Date() - dateObj.getTime()) / 1000

    if (diffSeconds < 60) {
        return `${Math.floor(diffSeconds)} secs ago`
    }

    var diffMins = diffSeconds / 60

    if (diffMins < 60) {
        return `${Math.floor(diffMins)} mins ago`
    }

    var diffHours = diffMins / 60

    if (diffHours < 24) {
        return `${Math.floor(diffHours)} hours ago`
    }

    var diffDays = diffHours / 24

    if (diffDays < 365) {
        return `${Math.floor(diffDays)} days ago`
    }

    return `${Math.floor(diffDays / 365)} years ago`
}