export default function toggle(list, value) {
    if (list.includes(value)) {
        return list.filter((el) => el !== value);
    } else {
        return [...list, value];
    }
}