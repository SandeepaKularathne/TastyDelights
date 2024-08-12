package lk.tastydelights.report;

public class ProductTypeCount {
	private String name;
	private long count;

	public ProductTypeCount(String name, long count) {
		this.name = name;
		this.count = count;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}
}
