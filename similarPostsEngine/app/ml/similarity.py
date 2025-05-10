from app.ml.model import model


def find_similar_posts(query_text: str, top_k: int = 5):
    query_vec = model.model.encode([query_text], convert_to_numpy=True)
    distances, indices = model.index.search(query_vec, top_k)

    results = []
    added_post_ids = set()
    for score, post_index in zip(distances[0], indices[0]):
        if post_index < len(model.posts):
            post_id = str(model.posts[post_index]["_id"])
            if post_id not in added_post_ids:
                results.append({
                    "id": post_id,
                    "title": model.posts[post_index]["title"],
                    "content": model.posts[post_index]["content"],
                    "score": float(score)
                })
                added_post_ids.add(post_id)

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
