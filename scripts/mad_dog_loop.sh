#!/bin/bash
# Mad Dog Evolution Loop
# Runs capability-evolver continuously with a short cooldown.

LOG_FILE="memory/mad_dog_evolution.log"
INTERVAL=600 # 10 minutes (Mad Dog Speed!)

echo "🔥 MAD DOG EVOLUTION LOOP STARTED at $(date)" >> $LOG_FILE

while true; do
    echo "----------------------------------------" >> $LOG_FILE
    echo "🧬 Cycle Start: $(date)" >> $LOG_FILE
    
    # Run Evolution
    export EVOLVE_REPORT_TOOL=feishu-card
    node skills/capability-evolver/index.js >> $LOG_FILE 2>&1
    
    EXIT_CODE=$?
    echo "🏁 Cycle End: $(date) (Exit Code: $EXIT_CODE)" >> $LOG_FILE
    
    # Zero Cooldown - True Infinite Loop
    echo "⚡ INSTANT RESTART (No Sleep)..." >> $LOG_FILE
    # sleep $INTERVAL (Disabled for Mad Dog Mode)
done
