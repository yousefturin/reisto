export const GenerateRoomId = (userId1, userId2) => {
    const sortedIds = [userId2, userId1].sort();
    return roomId = sortedIds.join('-');
}