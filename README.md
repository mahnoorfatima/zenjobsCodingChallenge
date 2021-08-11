# Zenjob Coding Challenge

This is a **coding challenge** intended for **full-stack engineers**, containing **three different tasks**. For finishing Tasks A, B and C with some documentation, you should not need to invest more than **2 hours**.

## Introduction

This repository consists of a simplified version of Zenjob's platform:

- *Companies* order *jobs*
- Each *job* contains one or more *shifts*
- *Talents* (workers) can be booked for *shifts*

### No bootstrapping needed

To allow you to dive right into it, there is a simplified version of a job service provided, which already contains the following features:

- Creating a *job* with multiple shifts
- Fetching the *shifts* for a specific *job*
- Booking a *talent* to a *shift*

Feel free to adjust it as much as you like.

### Product boundary conditions

There are certain boundary conditions defined which **must** be met by the service.

- A *job* should have at least one *shift*
- The start date of a *job* cannot be in the past
- The end date of a *job* should be after the start date
- A *shift*'s length cannot exceed 8 hours
- A *shift*'s length has to be at least 2 hours
- A *talent* cannot work consecutive shifts, there has to be at least a 6 hours break between *shifts* for the same *talent*

## Objective

Your job is to modify the existing service so it satisfies the following requirements:

### Task A

- **AS** a *company*
- **I CAN** cancel a *job* I ordered previously
- **AND** if the *job* gets cancelled all of its *shifts* get cancelled as well

### Task B

- **AS** a *company*
- **I CAN** cancel a single *shift* of a job I ordered previously

### Task C

- **AS** a *company*
- **I CAN** cancel all of my shifts which were booked for a specific talent
- **AND** replacement shifts are created with the same dates

## Evaluation criteria

Your submission will be evaluated by at least 2 people on the following criteria:

- Documentation
- API design
- System design
- Bugs
- Completeness of tasks
- Tests
- Code styling

## Final notes

If you have any questions, feel free to reach out to us at any time.
