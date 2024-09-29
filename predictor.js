// ==UserScript==
// @name         Bloxflip Predictor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  code thing ahh
// @author       Xeenrim
// @match        *://bloxflip.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const predictions = {}; 

    const container = document.createElement('div');
    container.id = 'bloxflip-predictor';
    container.innerHTML = `
        <div id="predictor-modal">
            <div class="modal-header">
                <h2>Bloxflip Predictor</h2>
                <button id="close-modal">X</button>
            </div>
            <div class="modal-body">
                <p>Game ID: <input type="text" id="game-id" placeholder="Enter your Game ID" required></p>
                <p>Bet Amount: <input type="number" id="bet-amount" value="10" min="1"></p>
                <div id="grid-container"></div>
                <button id="predict-btn">Predict</button>
            </div>
            <div class="modal-footer">
                <small>Powered by YourAlgorithm</small>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Inject custom styles
    const style = document.createElement('style');
    style.innerHTML = `
        #bloxflip-predictor {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2d2d2d;
            color: white;
            border-radius: 10px;
            width: 320px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            display: none; /* Set to none initially */
            z-index: 9999;
            cursor: move; /* Allow moving */
        }
        #predictor-modal {
            padding: 20px;
        }
        .modal-header, .modal-footer {
            text-align: center;
            margin-bottom: 15px;
        }
        #close-modal {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            border: none;
            color: white;
            padding: 5px;
            border-radius: 50%;
            cursor: pointer;
        }
        #predict-btn {
            width: 100%;
            background-color: #007bff;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #predict-btn:hover {
            background-color: #0056b3;
        }
        #grid-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(5, 1fr);
            gap: 5px;
            margin: 15px 0;
        }
        .grid-cell {
            width: 50px;
            height: 50px;
            background: #444;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: white;
        }
        .safe-spot {
            background: #28a745; /* Green for safe spots */
        }
        .mine {
            background: #dc3545; /* Red for mines */
        }
    `;
    document.head.appendChild(style);

    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.getElementById('close-modal').onclick = () => {
        container.style.display = 'none';
    };

    function generateGrid() {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        const safeSpots = Math.floor(Math.random() * (2)) + 4; 

        let totalCells = 25;
        let safeSpotCount = 0;

        while (safeSpotCount < safeSpots) {
            const index = Math.floor(Math.random() * totalCells);
            const cell = gridContainer.children[index];

            if (cell && !cell.classList.contains('safe-spot')) {
                cell.classList.add('safe-spot');
                cell.innerText = '🪐'; // Safe spot emoji
                safeSpotCount++;
            }
        }

        for (let i = 0; i < 25; i++) {
            const cell = gridContainer.children[i];
            if (!cell.classList.contains('safe-spot')) {
                cell.classList.add('mine');
                cell.innerText = '🌑'; // Mine emoji
            }
        }
    }

    document.getElementById('predict-btn').onclick = () => {
        const gameId = document.getElementById('game-id').value;
        if (gameId) {
            if (!predictions[gameId]) {
                predictions[gameId] = [];
                generateGrid(); 
            } else {
                alert(`Predictions already made for Game ID: ${gameId}`);
            }
        } else {
            alert('Please enter your Game ID.');
        }
    };

    container.style.display = 'block';
    generateGrid();

})();
