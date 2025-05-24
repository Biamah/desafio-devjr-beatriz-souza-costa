<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'end_date',
        'completed',
        'user_id'
    ];

    protected $casts = [
        'end_date' => 'date',
        'completed' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function markAsCompleted()
    {
        $this->update(['completed' => true]);
    }

    public function markAsIncompleted()
    {
        $this->update(['completed' => false]);
    }
}
