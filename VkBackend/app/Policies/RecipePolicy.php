<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Recipe;
use Illuminate\Auth\Access\HandlesAuthorization;

class RecipePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the recipe.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Recipe  $recipe
     * @return bool
     */
    public function update(User $user, Recipe $recipe)
    {
        // Only the owner of the recipe can update it
        return $user->id === $recipe->user_id;
    }

    /**
     * Determine whether the user can delete the recipe.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Recipe  $recipe
     * @return bool
     */
    public function delete(User $user, Recipe $recipe)
    {
        // Only the owner of the recipe can delete it
        return $user->id === $recipe->user_id;
    }
}
