from app.ml.model import model


def find_similar_posts(query_text: str, top_k: int = 5):
    query_vec = model.model.encode([query_text], convert_to_numpy=True)
    D, I = model.index.search(query_vec, top_k)

    results = []
    for score, idx in zip(D[0], I[0]):
        if idx < len(model.posts):
            results.append({
                "id": str(model.posts[idx]["_id"]),
                "title": model.posts[idx]["title"],
                "content": model.posts[idx]["content"],
                "score": float(score)
            })

    return results
