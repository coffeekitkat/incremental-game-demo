import * as Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import uuid from 'uuid';
export default class Demo extends Phaser.Scene
{
    private socket: Socket;
    private player: any = {
        playerId: -1,
        reward: 0,
    };

    private rewardFromOnlineIdling: number = 0;

    private rewardText:  Phaser.GameObjects.Text;

    private btnClaimReward: Phaser.GameObjects.Text;

    constructor ()
    {
        super('demo');
    }

    preload ()
    { 
        this.load.image('coin', 'assets/coin.png');
    }

    create ()
    { 
        this.socket = io('http://127.0.0.1:3333');

        this.socket.on('connect', function () {
        	console.log('Connected!');
        });
        

        this.btnClaimReward = this.add.text(400, 300, 'Claim Rewards!', {
            fontSize: 'bold 24px Arial',
            color: '#222222',
            align: 'center',
        })
        .setStyle({ backgroundColor: '#00bec3' })
        .setOrigin(0.5)
        .setPadding(10)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this.onBtnClaimReward, this);


        // Create a text object to display rewards
        this.rewardText = this.add.text(200, 300, `Rewards: ${this.player.reward}`, {
            font: '24px Arial',
            color: '#ffffff',
        });
        this.rewardText.setOrigin(0.5);


         // Listen for rewards event from the server
        this.socket.on('rewards', (data) => {
            const { rewardAmount, idleAccReward } = data;
            this.player.reward = rewardAmount;
            this.rewardFromOnlineIdling = idleAccReward
            // Update the reward text with the received reward amount
            this.rewardText.setText(`Rewards: ${rewardAmount}`);
            
            this.showRewardPopup(this.rewardFromOnlineIdling);
            this.showRewardAnimation();
            
        });

        this.socket.on('player-data', (data) => {
            this.player.playerId = data.playerId;
            this.player.reward = data.rewardAmount
        })

        this.game.events.on('poststep', this.updateReward, this);

        setInterval(() => { 
            this.showRewardPopup(1);
        }, 2000);
    }

    updateReward() {
        this.rewardText.setText(`Rewards: ${this.player.reward}`);
    }

    onBtnClaimReward() {
        // Send a request to the server to grant idle rewards
        this.socket.emit('claim-rewards', { playerId: 1 });
    }

    showRewardPopup(accumulatedRewards: number) {
        if (accumulatedRewards > 0) {
            const rewardPopup = this.add.image(400, 250, 'coin');
            rewardPopup.setOrigin(0.5);
            rewardPopup.setScale(2);
            this.tweens.add({
              targets: rewardPopup,
              y: 100,
              alpha: 0,
              duration: 1000,
              ease: 'Linear',
              onComplete: () => {
                rewardPopup.setPosition(400, 250);
                rewardPopup.setAlpha(0);
              },
            });
        }
      }
    showRewardAnimation() {
        const rewardAnimationDuration = 1000; // Duration of the animation in milliseconds
        const rewardAnimationText = this.add.text(this.rewardText.x, this.rewardText.y, `+${this.rewardFromOnlineIdling}`, {
          fontSize: '24px',
          color: '#00ff00',
        });
    
        rewardAnimationText.setAlpha(1);
        rewardAnimationText.setY(this.rewardText.y - 50);
    
        this.tweens.add({
          targets: rewardAnimationText,
          y: rewardAnimationText.y - 50,
          alpha: 0,
          duration: rewardAnimationDuration,
          ease: 'Linear',
          onComplete: () => {
            rewardAnimationText.destroy();
          },
        });
    }

    shutdown() {
        this.socket.close();
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Demo,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
