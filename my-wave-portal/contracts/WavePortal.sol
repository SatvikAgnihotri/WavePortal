// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol"; //Allows us to do console logs in our contract - makes debugging easier

contract WavePortal {
    //Initialize a contract
    uint256 totalWaves; //Initialize a variable (automatically initilaizes at 0) - state variable - permanently in contract storage

    /* We will be using this to help generate a random number */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    // I created a struct here named Wave; custom datatype where we can customize what we want to hold inside it.
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /* Declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves people sends to me */
    Wave[] waves;

    /*  This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, storing the address with the last time the user waved at us. */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        // Initialize a function, and authorize it to be able to pay people out
        console.log(
            "Life is about finding strength in yourself, not security in the world."
        );
        //Log text into the console
        seed = (block.timestamp + block.difficulty) % 100;
        //Set the initial seed. (%100 brings it down to a range between 1 and 100)
    }

    function wave(string memory _message) public {
        /* 15 minute timestamp buffer */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /* Update the current timestamp we have for the user */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender, _message);
        //msg.sender = wallet address of the person who calls the function - built in authentication. You need a wallet address to call it.
        waves.push(Wave(msg.sender, _message, block.timestamp));
        //Actually storing wave data in the array

        //Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /* Give a 50% chance that the user wins the prize. If the seed is less than or = to 50, gets*/
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            /* Sending Prize Money */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            // (msg.sender).call{value: prizeAmount}("") --> Actually sending money
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            //Giving two options for output. Success or failted to writhdraw money
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     Returns the struct array, waves, to us - makes it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
