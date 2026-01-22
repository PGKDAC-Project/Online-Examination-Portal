package com.oep.entities;

import java.time.LocalDate;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@AttributeOverride(name = "id", column = @Column(name = "batch_id"))
@Table(name = "batches", indexes = {
		@Index(name = "idx_batch_batch_name", columnList = "batch_name"),
		@Index(name = "idx_batch_start_date", columnList = "start_date"),
		@Index(name = "idx_batch_end_date", columnList = "end_date")
})
@Getter
@Setter
public class Batch extends BaseEntity{
	@Column(name = "batch_name", length = 30, nullable = false, unique = true)
	private String batchName;
	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;
	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;
}
