# Advanced Flow Management Framework

## 🚀 **Overview**

The **TS-Flow** Framework is a modular, extensible framework specifically designed to simplify workflow and task orchestration. It provides a powerful structure and intuitive API to handle simple to complex orchestrations, letting developers focus on business logic while ensuring efficient execution and scalability.

### **✨ Dynamic Workflow Composition**
- Build and manage workflows dynamically using a structured and expressive API.
- Compose workflows with a mix of sequential, parallel, and conditional task execution patterns.
- Easily integrate custom logic into workflows for tailored solutions.

### **💥 Robust Error Handling**
- Centralized error management ensures workflows remain resilient.
- Supports retry policies with configurable backoff strategies such as exponential, fixed, and linear delays.
- Integrate custom error-handling logic to address domain-specific concerns.

### **⏱️ Advanced Scheduling**
- Schedule tasks with precision using cron expressions for periodic or time-based execution.
- Tasks can be dynamically started, stopped, or rescheduled without disrupting the workflow.
- Supports long-running workflows with scheduled task re-triggering.

### **⚡ Scalable Task Execution**
- Execute tasks in parallel, sequentially, or conditionally based on runtime inputs.
- Includes built-in support for managing complex dependencies between tasks.
- Tasks can be individually configured with timeouts, retries, and hooks for fine-grained control.

### **🔌 Pluggable Components**
- Modular architecture allows seamless integration of custom loggers, error handlers, and persistence layers, enhancing framework extensibility.
- Use your own logging framework (e.g., Winston, Bunyan) or stick with the default logger.
- Integrate with persistence solutions to save and restore workflow states for fault tolerance.

### **🔄 Lifecycle Hooks**
- Inject custom logic at various workflow and task lifecycle stages:
  - **Workflow Start/Finish**
  - **Task Start/Finish**
  - **Error Handling**
  - **Retry Events**
- Enable pre- and post-execution behaviors for extensive flexibility.

### **📡 Event-Driven Architecture**
- The framework's built-in `EventBus` provides robust communication between components, ensuring cohesion and flexibility.
- Emit, listen to, and handle custom events during workflow and task execution.
- Simplify monitoring, debugging, and integration with external systems through event-driven tracking.

### **📈 Extensible Framework**
- Built to scale with varying demands, from simple process orchestration to enterprise-level workflow management, showcasing the flexibility of the framework.
- Future-proof architecture with support for additional extensions and modules.
- Comprehensive TypeScript typings for type safety and developer productivity.

### **🔒 Persistence and State Management**
- Save and restore task and workflow states using the persistence layer.
- Ensure continuity in case of failures or restarts, making workflows resilient.
- Supports both in-memory and external database-backed persistence mechanisms.

---

## ✨ **Features**

### **1. Workflow Composition**
- Compose workflows dynamically with **sequential**, **parallel**, and **conditional** execution patterns.
- Support for **middleware** at the workflow and task levels for pre- and post-execution logic.
- Lifecycle hooks for seamless integration of custom behaviors.

### **2. Middleware Integration**
- Attach middleware functions to workflows or tasks to extend capabilities.
- Middleware supports **chaining** and **asynchronous execution**.

### **3. Error Handling**
- Centralized error handling with support for retries and configurable backoff strategies.
- Error hooks for workflow-level and task-level custom error management.

### **4. Task Management**
- Tasks support configurable **timeouts**, **retries**, and **backoff strategies**.
- Task context enables the sharing of input and output data across workflows.

### **5. Scheduling**
- Schedule tasks with **cron expressions** for periodic execution.
- Dynamic control over scheduled tasks (start, stop, reschedule).

### **6. Persistence**
- Save and restore workflow and task states using in-memory or external persistence layers.
- Ensure reliability and fault tolerance across workflows.

### **7. Logging**
- Integrated logging with customizable levels (DEBUG, INFO, WARN, ERROR).
- Pluggable logging solutions for external integration.

### **8. Event-Driven Architecture**
- Built-in ```EventBus``` for robust inter-component communication.
- Emit and listen to custom events for real-time tracking and debugging.

---

## 📦 Installation

Install the package using npm or yarn:

```bash
npm install @dyniqo/ts-flow
```
or
```bash
yarn add @dyniqo/ts-flow
```

---

## 📖 **Usage Examples**

### **Step 1: Creating a Workflow**

The core of the framework revolves around the `Workflow`. component. Start by creating a workflow with the `FlowManager`.

```typescript
import { FlowManager } from '@dyniqo/ts-flow';

const flowManager = new FlowManager();

const workflow = flowManager.createWorkflow('MyFirstWorkflow');
```

---

### **Step 2: Creating Simple Tasks**

Tasks are the building blocks of a workflow. Here’s how you create a simple task.

```typescript
const taskA = flowManager.createTask(
  'taskA',
  async (context) => {
    console.log('Executing task with input:', context.getInput());
    return "Task completed successfully";
  }
);

const workflowWithTask = flowManager.createWorkflow('WorkflowWithTask')
  .addTask(taskA)
  .build();

workflowWithTask.execute({ inputData: 'Sample Input' }).then((output) => {
  console.log('Workflow output:', output);
});
```

---

### **Step 3: Middleware Support**

Middleware allows you to extend workflows with custom logic.

```typescript
const middleware = async (context, next) => {
  console.log('Before Task Execution');
  await next();
  console.log('After Task Execution');
};

const workflowWithMiddleware = flowManager.createWorkflow('WorkflowWithMiddleware')
  .setOptions({ middleware: [middleware] })
  .addTask(taskA)
  .build();

workflowWithMiddleware.execute({ input: 'Middleware Example' });
```
---

### **Step 4: Adding Complex Tasks**

Tasks can be conditional, parallel, or scheduled.

#### **Conditional Task**

Conditional tasks execute their child tasks only if a given condition is true.

```typescript
const conditionalTask = flowManager.createConditionalTask(
  'CheckCondition',
  (context) => context.getInput().shouldRun === true,
  [taskA]
);

const workflowWithConditionalTask = flowManager.createWorkflow('WorkflowWithCondition')
  .addTask(conditionalTask)
  .build();

workflowWithConditionalTask.execute({ shouldRun: true });
```

#### **Parallel Task**

Parallel tasks allow multiple tasks to execute simultaneously.

```typescript
const taskB = flowManager.createTask('TaskB', async () => console.log('TaskB executed'));
const taskC = flowManager.createTask('TaskC', async () => console.log('TaskC executed'));

const parallelTask = flowManager.createParallelTasks('ParallelTasks', [taskB, taskC]);

const workflowWithParallelTasks = flowManager.createWorkflow('WorkflowWithParallel')
  .addTask(parallelTask)
  .build();

workflowWithParallelTasks.execute({});
```

#### **Scheduled Task**

Scheduled tasks execute at specified intervals using cron expressions.

```typescript
const scheduledTask = flowManager.createScheduledTask(
  'DailyTask',
  async () => console.log('Executing daily task'),
  '*/5 * * * * *' // Every 5 seconds
  // '0 0 * * *' // Every day at midnight
);

scheduledTask.start();
```

---

### **Step 4: Persistence**

Save and restore workflows and tasks for fault-tolerant execution.

```typescript
const persistentManager = new FlowManager({
  persistence: new InMemoryPersistence(),
});

const persistentTask = persistentManager.createTask(
  'PersistentTask',
  async (context) => {
    console.log('Executing persistent task');
    context.set('PersistenceKey', 'Persistence value');
  }
);

const workflowWithPersistence = persistentManager.createWorkflow('PersistentWorkflow')
  .addTask(persistentTask)
  .build();

workflowWithPersistence.execute({});
```

---

### **Step 5: Applying Timeout Policies**

Timeout policies limit the execution time for tasks. Tasks exceeding the timeout fail.

```typescript
const timeoutTask = flowManager.createTask(
  'TimeoutTask',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate a long task
  },
  { timeout: 5000 } // Fail if task takes more than 5 seconds
);

const workflowWithTimeout = flowManager.createWorkflow('TimeoutWorkflow')
  .addTask(timeoutTask)
  .build();

workflowWithTimeout.execute({}).catch((error) => {
  console.error('Task timed out:', error.message);
});
```

---

### **Step 6: Adding Lifecycle Hooks**

Hooks allow you to inject custom logic at various points in the workflow lifecycle.

#### **Example: Logging Task Start and Finish**

```typescript
const taskA = flowManager.createTask('TaskB', async () => console.log('TaskB executed'));

const workflowWithHooks = flowManager.createWorkflow('HookedWorkflow')
  .addTask(taskA)
  .addHook('onTaskStart', async (taskContext) => {
    console.log(`Task ${taskContext.name} is starting.`);
  })
  .addHook('onTaskFinish', async (taskContext) => {
    console.log(`Task ${taskContext.name} finished.`);
  })
  .build();

workflowWithHooks.execute({});
```

---

### **Step 7: Managing Events**

Use the built-in `EventBus` for communication between tasks or workflows.

```typescript
import { EventBus } from '@dyniqo/ts-flow';

const eventBus = EventBus.getGlobalInstance();

// Listener for task events
eventBus.on('taskCompleted', (data) => {
  console.log('Task completed:', data);
});

// Emit an event when a task is done
const taskWithEvent = flowManager.createTask(
  'EventTask',
  async (context) => {
    console.log('Executing EventTask');
    eventBus.emit('taskCompleted', { taskId: 'EventTask', status: 'success' });
  }
);

const workflowWithEvents = flowManager.createWorkflow('EventWorkflow')
  .addTask(taskWithEvent)
  .build();

workflowWithEvents.execute({});
```

---

### **Step 8: Advanced Backoff Strategies**

Backoff strategies control retry delays.

#### **Exponential Backoff**

```typescript
const exponentialTask = flowManager.createTask(
  'ExponentialBackoffTask',
  async () => {
    throw new Error('Simulating failure');
  },
  {
    retryCount: 5,
    backoffOptions: { strategy: 'exponential', delay: 100, maxDelay: 2000 }
  }
);

const workflowWithExponentialBackoff = flowManager.createWorkflow('ExponentialBackoffWorkflow')
  .addTask(exponentialTask)
  .build();

workflowWithExponentialBackoff.execute({});
```

---

### **Step 9: Persistence for State Management**

Persist workflow or task states for reliability.

```typescript
const persistentFlowManager = new FlowManager({
  persistence: {
    saveWorkflowState: async (workflowId, state) => {
      console.log(`Saving workflow state for ${workflowId}:`, state);
    },
    getWorkflowState: async (workflowId) => {
      console.log(`Retrieving state for ${workflowId}`);
      return null; // Simulate no existing state
    },
    saveTaskState: async (taskId, state) => {
      console.log(`Saving task state for ${taskId}:`, state);
    },
    getTaskState: async (taskId) => {
      console.log(`Retrieving state for ${taskId}`);
      return null; // Simulate no existing state
    }
  }
});

const persistentTask = persistentFlowManager.createTask(
  'PersistentTask',
  async (context) => {
    console.log('Executing persistent task');
    context.setOutput('Persistence applied');
  }
);

const workflowWithPersistence = persistentFlowManager.createWorkflow('PersistentWorkflow')
  .addTask(persistentTask)
  .build();

workflowWithPersistence.execute({});
```

---

### **Step 10: Comprehensive Workflow Example**

Here is a **comprehensive example** that combines sequential, parallel, and conditional tasks, middleware, hooks, and dynamic state management, demonstrating the full capabilities of the framework.

![Sample Workflow](media/my-workflow.gif)

```typescript
import { FlowManager } from '@dyniqo/ts-flow';

// Initialize the FlowManager
const flowManager = new FlowManager({});

// Define TaskA: A task that stores a value in the context and returns a result
const taskA = flowManager.createTask(
  "TaskA",
  async (context) => {
    context.set("AExecuted", true);
    return "ResultFromA";
  },
  { retryCount: 2, timeout: 5000 }
);

// Define TaskB: A task that uses the output of TaskA and adds a delay
const taskB = flowManager.createTask("TaskB", async (context) => {
  await new Promise((res) => setTimeout(res, 3000));
  const aResult = context.getTaskOutput("TaskA");
  context.set("BInput", aResult);
  return "ResultFromB";
});

// Define TaskC: A task that appends its result to the output of TaskB
const taskC = flowManager.createTask("TaskC", async (context) => {
  const bResult = context.getTaskOutput("TaskB");
  return bResult + " + ResultFromC";
});

// Define TaskD: A simple task that returns a static result
const taskD = flowManager.createTask("TaskD", async (context) => {
  return "ExtraResultFromD";
});

// Define a conditional task: Executes TaskD if TaskC's result meets a condition
const conditionalTask = flowManager.createConditionalTask(
  "ConditionalTask",
  (ctx) => {
    const cResult = ctx.getTaskOutput("TaskC");
    return cResult.includes("C");
  },
  [taskD]
);

// Define parallel tasks: TaskE and TaskF will execute simultaneously
const taskE = flowManager.createTask("TaskE", async (context) => "ResultE");
const taskF = flowManager.createTask("TaskF", async (context) => "ResultF");
const parallelTasks = flowManager.createParallelTasks("ParallelGroup", [
  taskE,
  taskF,
]);

// Build the workflow with tasks, middleware, and hooks
const builder = flowManager
  .createWorkflow("MyWorkflow", {
    retryCount: 1,
    timeout: 0,
    middleware: [
      async (ctx, next) => {
        ctx.set("middlewareLog", `Running at task index`);
        await next();
      },
    ],
  })
  .addHook("onWorkflowStart", async (context) => {
    console.log("Workflow started with input:", context.getInput());
  })
  .addHook("onTaskStart", async (task) => {
    console.log(`Task started: ${task.name}`);
  })
  .addHook("onTaskFinish", async (task) => {
    console.log(`Task finished: ${task.name}`);
  })
  .addHook("onWorkflowFinish", async (context) => {
    console.log("Workflow finished with output:", context);
  })
  .addTask(taskA)
  .addTask(taskB)
  .addTask(parallelTasks)
  .addTask(taskC)
  .addTask(conditionalTask);

// Execute the workflow
const workflow = flowManager.buildWorkflow(builder);

const inputData = { initial: "data" };
console.log("--- Starting Workflow ---");
const executionPromise = workflow.execute(inputData);

// Pause and resume logic
setTimeout(async () => {
  console.log("--- Pausing Workflow ---");
  await flowManager.pauseWorkflow("MyWorkflow");

  console.log(
    "Workflow Status:",
    flowManager.getWorkflowStatus("MyWorkflow")
  );
  console.log(
    "Task Statuses:",
    flowManager.getWorkflowTasksStatus("MyWorkflow")
  );

  setTimeout(async () => {
    console.log("--- Resuming Workflow ---");
    await flowManager.resumeWorkflow("MyWorkflow");
  }, 2000);
}, 2000);

// Log final output and status
const finalOutput = await executionPromise;
console.log("Final Output:", finalOutput);

console.log("--- Workflow Completed ---");
console.log("Workflow Status:", flowManager.getWorkflowStatus("MyWorkflow"));
console.log(
  "Task Statuses:",
  flowManager.getWorkflowTasksStatus("MyWorkflow")
);
```

---

## 📬 Contact Us

We'd love to hear from you! If you have questions, suggestions, or need support, here are the ways to reach us:

📧 **Email:** [dyniqo@gmail.com](mailto:dyniqo@gmail.com)  
🐛 **GitHub Issues:** [Open an Issue](https://github.com/Dyniqo/ts-flow/issues)

We look forward to hearing from you!
