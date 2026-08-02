from app.llm import suggest_priority_and_tag


def test_urgent_task_gets_high_priority():
    result = suggest_priority_and_tag(
        title="Finish resume today",
        notes="Apply before the deadline",
    )

    assert result["priority"] == "high"
    assert result["tag"] == "work"


def test_grocery_task_gets_errand_tag():
    result = suggest_priority_and_tag(
        title="Buy groceries",
        notes="Get fruit and coffee",
    )

    assert result["tag"] == "errand"


def test_low_priority_words():
    result = suggest_priority_and_tag(
        title="Maybe organize photos someday",
        notes="No rush",
    )

    assert result["priority"] == "low"