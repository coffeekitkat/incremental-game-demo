import * as Phaser from 'phaser';

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    { 
    }

    create ()
    { 
        // Create a rectangle sprite
        const rectangle = this.add.rectangle(400, 300, 200, 100, 0xff0000);

        // Enable input for the rectangle
        rectangle.setInteractive();

        // Register a click event handler for the rectangle
        rectangle.on('pointerdown', () => {
            console.log('Rectangle clicked!');
        });
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
