package coogether.backend.repository.recipe;

import coogether.backend.dto.RecipeDto;
import coogether.backend.dto.simple.SimpleRecipeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecipeRepositoryCustom {
    Page<SimpleRecipeDto> allRecipePage(Pageable pageable);
    Page<RecipeDto> searchRecipePage(Pageable pageable);

    Page<SimpleRecipeDto> getRecipeListPagingByRecipeName(String recipeName, Pageable pageable);
}