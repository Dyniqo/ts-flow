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
### **Core Features**
1. **Workflow Management**:
   - Build workflows with sequential, parallel, and conditional logic.
   - Track progress and execution status.

2. **Task Handling**:
   - Configurable retries, timeouts, and backoff strategies.
   - Task context management for sharing input/output data.

3. **Error Management**:
   - Unified error handling with context-aware details.
   - Retry policies with support for linear, exponential, or fixed delays.

4. **Logging**:
   - Integrated logging with customizable levels (DEBUG, INFO, WARN, ERROR).
   - Plug-and-play external logging systems.

5. **Persistence**:
   - Save workflow/task states and restore them for recovery scenarios.
   - Easily integrate with custom persistence layers.

6. **Scheduling**:
   - Run tasks periodically using cron expressions.
   - Manage schedules programmatically.

7. **Hooks and Events**:
   - Framework lifecycle hooks for workflows (`onWorkflowStart`, `onWorkflowError`, etc.).
   - Event-driven model for inter-component communication.

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
console.log('Workflow created:', workflow);
```

---

### **Step 2: Creating Simple Tasks**

Tasks are the building blocks of a workflow. Here’s how you create a simple task.

```typescript
const simpleTask = flowManager.createTask(
  'SimpleTask',
  async (context) => {
    console.log('Executing task with input:', context.getInput());
    context.setOutput('Task completed successfully');
  }
);

const workflowWithTask = flowManager.createWorkflow('WorkflowWithTask')
  .addTask(simpleTask)
  .build();

workflowWithTask.execute({ inputData: 'Sample Input' }).then((output) => {
  console.log('Workflow output:', output);
});
```

---

### **Step 3: Adding Complex Tasks**

Tasks can be conditional, parallel, or scheduled.

#### **Conditional Task**

Conditional tasks execute their child tasks only if a given condition is true.

```typescript
const conditionalTask = flowManager.createConditionalTask(
  'CheckCondition',
  (context) => context.getInput().shouldRun === true,
  [simpleTask]
);

const workflowWithConditionalTask = flowManager.createWorkflow('WorkflowWithCondition')
  .addTask(conditionalTask)
  .build();

workflowWithConditionalTask.execute({ shouldRun: true });
```

#### **Parallel Task**

Parallel tasks allow multiple tasks to execute simultaneously.

```typescript
const parallelTask = flowManager.createParallelTasks([taskA, taskB, taskC]);

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
  async () => {
    console.log('Running daily task');
  },
  '0 0 * * *' // Every day at midnight
);

scheduledTask.start(); // Start the scheduled task
```

---

### **Step 4: Using Retry Policies**

Retry policies ensure tasks are reattempted in case of failure.

```typescript
const retryTask = flowManager.createTask(
  'RetryExample',
  async () => {
    console.log('Attempting task...');
    if (Math.random() < 0.7) throw new Error('Task failed!');
    return 'Task succeeded!';
  },
  { retryCount: 3 } // Retry up to 3 times
);

const workflowWithRetry = flowManager.createWorkflow('RetryWorkflow')
  .addTask(retryTask)
  .build();

workflowWithRetry.execute({});
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
const workflowWithHooks = flowManager.createWorkflow('HookedWorkflow')
  .addTask(simpleTask)
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

Combining tasks, hooks, retry, timeout, and parallel execution.

```typescript
const finalWorkflow = flowManager.createWorkflow('ComprehensiveWorkflow')
  .addTask(
    flowManager.createTask('TaskA', async () => {
      console.log('TaskA executed');
    })
  )
  .addParallelTasks([
    flowManager.createTask('TaskB', async () => {
      console.log('TaskB executed');
    }),
    flowManager.createTask('TaskC', async () => {
      console.log('TaskC executed');
    })
  ])
  .addConditionalTasks(
    (context) => context.getInput().runConditionals === true,
    [
      flowManager.createTask('ConditionalTask1', async () => {
        console.log('ConditionalTask1 executed');
      })
    ]
  )
  .addHook('onWorkflowStart', async () => {
    console.log('Workflow starting...');
  })
  .addHook('onWorkflowFinish', async () => {
    console.log('Workflow completed.');
  })
  .build();

finalWorkflow.execute({ runConditionals: true });
```

---

## 📬 Contact Us

We'd love to hear from you! If you have questions, suggestions, or need support, here are the ways to reach us:

📧 **Email:** [dyniqo@gmail.com](mailto:dyniqo@gmail.com)  
🐛 **GitHub Issues:** [Open an Issue](https://github.com/Dyniqo/ts-flow/issues)

We look forward to hearing from you!
