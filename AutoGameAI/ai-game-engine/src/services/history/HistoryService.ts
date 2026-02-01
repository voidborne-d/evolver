export interface ICommand {
    execute(): void;
    undo(): void;
}

export class HistoryService {
    private undoStack: ICommand[] = [];
    private redoStack: ICommand[] = [];

    public execute(command: ICommand): void {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = []; // Clear redo stack on new action
    }

    public undo(): void {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    public redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
}
