import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */

const connectedPlayers = new Map();

// Set idle reward configuration

// Reward interval in milliseconds. Default 1 second.
const idleRewardInterval = 400;

// Reward amount per second
const idleRewardAmount = 1; 

Ws.io.on('connection', (socket) => {

  const initialPlayer = {
    playerId: 1,
    rewardAmount: 0,
  };

  if(!connectedPlayers.has(initialPlayer.playerId)) {
    connectedPlayers.set(initialPlayer.playerId, {
      rewardAmount: 0,
      lastRewardTime: Date.now(),
      ...initialPlayer,
    });
    
    console.log('new player')
    socket.emit('player-data', connectedPlayers.get(initialPlayer.playerId));
  } else {
    console.log('bro emit player data',connectedPlayers.get(initialPlayer.playerId))
    socket.emit('player-data', connectedPlayers.get(initialPlayer.playerId));
  }


  socket.on('claim-rewards', (data) => {
    // Check if the player is connected
    if (connectedPlayers.has(data.playerId)) {
      // Calculate and accumulate rewards for the player
      const player = connectedPlayers.get(data.playerId);
      const currentTime = Date.now();
      const idleTime = currentTime - player.lastRewardTime;
      const rewards = Math.floor(idleTime / idleRewardInterval) * idleRewardAmount;

      player.rewardAmount += rewards;

      if (rewards > 0) {
        player.lastRewardTime = currentTime;
      }
 
      console.log(`Yo player claimed the online-idle rewards`,{
        playerId: player.playerId,
        rewardAmount: player.rewardAmount,
        idleAccReward: rewards,
      })
      // Send the rewards to the player
      socket.emit('rewards', {
        rewardAmount: player.rewardAmount,
        idleAccReward: rewards,
      });
    }
  });

  socket.on('disconnect', () => {
    // Player disconnected
    console.debug('Player disconnected')
  });
})