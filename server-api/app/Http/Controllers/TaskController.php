<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->tasks();

        if ($request->has('completed')) {
            $query->where('completed', $request->boolean('completed'));
        }

        if ($request->has('due')) {
            $query->where('end_date', '<=', $request->input('due'));
        }

        $orderBy = $request->input('order_by', 'created_at');
        $orderDirection = $request->input('order_direction', 'desc');

        $validOrderFields = ['title', 'created_at', 'end_date', 'completed'];
        $validDirections = ['asc', 'desc'];

        if (in_array($orderBy, $validOrderFields) && in_array($orderDirection, $validDirections)) {
            $query->orderBy($orderBy, $orderDirection);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'end_date' => 'nullable|date',
            'completed' => 'boolean',
        ]);

        $validated['user_id'] = $request->user()->id;

        $task = $request->user()->tasks()->create($validated);

        return response()->json($task, 201);
    }

    public function show(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);
        return $task;
    }

    public function update(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $validatedData = $request->validate([
            'description' => 'nullable|string',
            'end_date' => 'sometimes|date',
            'completed' => 'sometimes|boolean'
        ]);

        $task->update($validatedData);
        return $task;
    }

    public function destroy(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);
        $task->delete();
        return response()->noContent();
    }
}
