package com.oep.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oep.entities.Batch;
import com.oep.repository.BatchRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {
    private final BatchRepository batchRepository;

    @Override
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    @Override
    public Batch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id: " + id));
    }

    @Override
    public Batch createBatch(Batch batch) {
        return batchRepository.save(batch);
    }

    @Override
    public Batch updateBatch(Long id, Batch batchDetails) {
        Batch batch = getBatchById(id);
        batch.setBatchName(batchDetails.getBatchName());
        batch.setStartDate(batchDetails.getStartDate());
        batch.setEndDate(batchDetails.getEndDate());
        return batchRepository.save(batch);
    }

    @Override
    public void deleteBatch(Long id) {
        Batch batch = getBatchById(id);
        batchRepository.delete(batch);
    }
}
