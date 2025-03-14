$(document).ready(function () {
    fetchMeals(); // Fetch saved meals when the page loads

    // Attach event listener to the save button (only if it exists)
    $("#saveSelection").on("click", function () {
        saveMealSelection();
    });
});

/**
 * Function to fetch saved meals from the backend and display them
 */
function fetchMeals() {
    $.get("/get_saved_meals", function (data) {
        if (!data.meals || data.meals.length === 0) {
            $("#meal-table-body").html("<tr><td colspan='4' class='text-center'>No meals saved.</td></tr>");
            return;
        }

        let rows = "";
        data.meals.forEach(meal => {
            rows += `
                <tr>
                    <td>${meal.name}</td>
                    <td>${meal.calories} kcal</td>
                    <td>${meal.ingredients}</td>
                    <td>${meal.date}</td>
                </tr>
            `;
        });

        $("#meal-table-body").html(rows);
    }).fail(function () {
        $("#meal-table-body").html("<tr><td colspan='4' class='text-center text-danger'>Failed to load meals.</td></tr>");
    });
}

/**
 * Function to save the selected meal in the database
 */
function saveMealSelection() {
    // Get user-selected meals
    let mealData = {
        name: "User Meal",
        calories: parseFloat($("#calories").val()) || 0,
        recipe_ingredients: JSON.stringify({
            Breakfast: $("#breakfast").val(),
            Lunch: $("#lunch").val(),
            Dinner: $("#dinner").val()
        })
    };

    $.ajax({
        url: "/save_meal",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(mealData),
        success: function () {
            alert("Meal selection saved successfully!");
            window.location.href = "/saved_meals"; // Redirect to saved meals page
        },
        error: function (xhr) {
            alert("Error saving meal selection: " + xhr.responseText);
        }
    });
}