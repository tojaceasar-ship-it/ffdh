import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Provider } from "react-redux";
import { store } from "@/store";
import ProductCard from "@/components/ProductCard";

expect.extend(toHaveNoViolations);

describe("ProductCard Accessibility", () => {
  const mockProps = {
    id: "test-product",
    slug: "test-product",
    variantId: "test-variant",
    name: "Test Product",
    price: 29.99,
    image: "/test-image.jpg",
    isLimited: false,
    isSoldOut: false,
    stock: 10,
  };

  it("passes accessibility audit", async () => {
    const { container } = render(
      <Provider store={store}>
        <ProductCard {...mockProps} />
      </Provider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("passes accessibility audit when sold out", async () => {
    const { container } = render(
      <Provider store={store}>
        <ProductCard {...mockProps} isSoldOut={true} />
      </Provider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("passes accessibility audit when limited", async () => {
    const { container } = render(
      <Provider store={store}>
        <ProductCard {...mockProps} isLimited={true} />
      </Provider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
