import { HistoryService, ICommand } from '../history/HistoryService';

export class CommandBridge {
    private historyService: HistoryService;

    constructor() {
        this.historyService = new HistoryService();
    }

    public handleCommand(type: string, payload: any): void {
        let command: ICommand | null = null;

        switch (type) {
            case 'babylon_create_entity':
                command = new CreateEntityCommand(payload);
                break;
            case 'babylon_remove_entity':
                command = new RemoveEntityCommand(payload);
                break;
            default:
                console.warn(`Unknown command type: ${type}`);
                return;
        }

        if (command) {
            this.historyService.execute(command);
        }
    }

    public handleUndo(): void {
        this.historyService.undo();
    }

    public handleRedo(): void {
        this.historyService.redo();
    }
}

class CreateEntityCommand implements ICommand {
    constructor(private payload: any) {}

    execute(): void {
        console.log(`[CommandBridge] Executing babylon_create_entity with payload:`, this.payload);
        // Implementation: Logic to create entity would go here
    }

    undo(): void {
        console.log(`[CommandBridge] Undoing babylon_create_entity (triggering remove) with payload:`, this.payload);
        // Inverse: Remove the entity
    }
}

class RemoveEntityCommand implements ICommand {
    constructor(private payload: any) {}

    execute(): void {
        console.log(`[CommandBridge] Executing babylon_remove_entity with payload:`, this.payload);
        // Implementation: Logic to remove entity would go here
    }

    undo(): void {
        console.log(`[CommandBridge] Undoing babylon_remove_entity (triggering create) with payload:`, this.payload);
        // Inverse: Re-create the entity
    }
}
