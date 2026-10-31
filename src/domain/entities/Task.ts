
export interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static create(title: string, id: string, createdAt = new Date()): Task {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      throw new Error("El título de la tarea es obligatorio.");
    }

    return new Task({
      id,
      title: cleanTitle,
      completed: false,
      createdAt
    });
  }

  static restore(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
