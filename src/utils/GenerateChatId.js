export const GenerateRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return roomId = sortedIds.join('-');
}