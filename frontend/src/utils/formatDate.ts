import {formatDistanceToNow} from "date-fns";

export const formatDate = (date?: string) => {
    if (!date) return "";
    else {
        return formatDistanceToNow(new Date(date), {addSuffix: true})
    }
};