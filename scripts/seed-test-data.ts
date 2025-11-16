import { initDb, createRoom, addPlayer, createStory } from '../lib/db';

// Initialize database
initDb();

// Create test room
const room = createRoom('freeform', null, 6);
console.log('✅ Created test room:', room.id);

// Create test players
const player1 = addPlayer(room.id, 'TestPlayer1', '#EF4444');
console.log('✅ Created player 1:', player1.id);

const player2 = addPlayer(room.id, 'TestPlayer2', '#3B82F6');
console.log('✅ Created player 2:', player2.id);

// Create story for the room
const story = createStory(room.id);
console.log('✅ Created story:', story.id);

console.log('\n📋 Test Data Summary:');
console.log(`Room ID: ${room.id}`);
console.log(`Player 1 ID: ${player1.id} (${player1.nickname})`);
console.log(`Player 2 ID: ${player2.id} (${player2.nickname})`);
console.log(`Story ID: ${story.id}`);
console.log('\n🚀 Use these IDs in the socket-test page!');
console.log(`Visit: http://localhost:3000/socket-test`);
