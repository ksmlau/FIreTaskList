import { Component } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';
import { Observable } from 'rxjs';
import { collectionData, collection, doc, Firestore, runTransaction, deleteDoc, addDoc, setDoc, updateDoc, getDocs } from '@angular/fire/firestore';

const taskConverter = {
  toFirestore: (task: Task) => {
    console.log("sendingtofirebase")
    return {
      title: task.title,
      status: task.status,
      description: task.description
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return { title: data.title, description: data.description } as Task;
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  // inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  // done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

  constructor(private dialog: MatDialog, private store: Firestore) { }
  async ngOnInit() {
    const arrayMap = {
      "todo": this.todo,
      "inProgress": this.inProgress,
      "done": this.done,
    };


    let toDoQuerySnapshot = await getDocs(collection(this.store, "task"));
    toDoQuerySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let newtask = doc.data() as Task
      const list = arrayMap[newtask.status as keyof typeof arrayMap];
      if (list) {
        list.push({ ...newtask, id: doc.id });
      } else {
        console.error('Invalid status');
      }
      console.log(doc.id, " => ", doc.data());
    });
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(async (result: TaskDialogResult) => {
        if (!result || !result.task.title) {
          return;
        }
        result.task.status = "todo";
        const docRef = await addDoc(collection(this.store, "task").withConverter(taskConverter), result.task);
        //console.log("Document written with ID: ", docRef.id);
        result.task.id = docRef.id;
        this.todo.push(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (result: TaskDialogResult | undefined) => {
      if (!result) {
        return;
      }
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        await deleteDoc(doc(this.store, "task", result.task.id as string));
        // console.log("deleted item with id:", result.task.id);
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
        const { id, ...taskData } = result.task;//need to destructure id out of Task as it is being sent into firebase
        await updateDoc(doc(this.store, "task", result.task.id as string).withConverter(taskConverter), taskData as Task);
      }
    });
  }

  async drop(event: CdkDragDrop<Task[]>): Promise<void> {
    if (event.previousContainer === event.container) {
      return;
    }
    event.previousContainer.data[event.previousIndex].status = event.container.id;
    const taskid = event.previousContainer.data[event.previousIndex].id;
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    await updateDoc(doc(this.store, "task", taskid as string), { status: event.container.id })
    console.log(event.container.data)
  }
}
