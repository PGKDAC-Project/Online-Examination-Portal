package com.oep.service;

import java.util.List;
import com.oep.entities.Batch;

public interface BatchService {
    List<Batch> getAllBatches();

    Batch getBatchById(Long id);

    Batch createBatch(Batch batch);

    Batch updateBatch(Long id, Batch batch);

    void deleteBatch(Long id);
}
